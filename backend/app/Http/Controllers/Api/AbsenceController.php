<?php

namespace App\Http\Controllers\Api;

use App\Models\Absence;
use App\Models\ScheduleEntry;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AbsenceController
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id' => ['required','integer','exists:users,id'],
            'date' => ['required','date'],
            'timeslot_id' => ['nullable','integer','exists:timeslots,id'],
            'full_day' => ['nullable','boolean'],
            'note' => ['nullable','string','max:255'],
        ]);

        $teacher = User::findOrFail($data['teacher_id']);
        $auth = $request->user();

        // Authorization (simple)
        if ($auth->role === 'teacher' && $auth->id !== $teacher->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if (in_array($auth->role, ['centeradmin','guard'], true) && $auth->center_id !== $teacher->center_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $date = Carbon::parse($data['date'])->startOfDay();
        $dow = (int)$date->dayOfWeekIso;

        if ($dow > 5) {
            throw ValidationException::withMessages(['date' => 'Only Monday-Friday allowed']);
        }

        $fullDay = (bool)($data['full_day'] ?? false);

        if ($fullDay) {
            $entries = ScheduleEntry::query()
                ->where('teacher_id', $teacher->id)
                ->where('day_of_week', $dow)
                ->get(['timeslot_id']);

            if ($entries->isEmpty()) {
                throw ValidationException::withMessages(['date' => 'Teacher has no classes that day']);
            }

            $created = 0;
            foreach ($entries as $entry) {
                $already = Absence::query()
                    ->where('teacher_id', $teacher->id)
                    ->where('date', $date->toDateString())
                    ->where('timeslot_id', $entry->timeslot_id)
                    ->exists();

                if ($already) continue;

                Absence::create([
                    'teacher_id' => $teacher->id,
                    'timeslot_id' => $entry->timeslot_id,
                    'date' => $date->toDateString(),
                    'note' => $data['note'] ?? null,
                ]);

                $created++;
            }

            return response()->json([
                'message' => 'Full-day absences created',
                'created' => $created,
            ], 201);
        }

        if (empty($data['timeslot_id'])) {
            throw ValidationException::withMessages(['timeslot_id' => 'Required when full_day is false']);
        }

        // Single timeslot absence
        $absence = Absence::create([
            'teacher_id' => $teacher->id,
            'timeslot_id' => $data['timeslot_id'],
            'date' => $date->toDateString(),
            'note' => $data['note'] ?? null,
        ]);

        return response()->json($absence, 201);
    }

    public function destroy(Request $request, Absence $absence)
    {
        $auth = $request->user();
        if ($auth->role === 'teacher' && $auth->id !== $absence->teacher_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if (in_array($auth->role, ['centeradmin', 'guard'], true) && $auth->center_id !== $absence->teacher->center_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $absence->delete();
        return response()->noContent();
    }
}
