<?php

namespace App\Http\Controllers\Api;

use App\Models\Absence;
use App\Models\ScheduleEntry;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScheduleEntryController
{
    public function index()
    {
        return ScheduleEntry::query()
            ->with(['timeslot','classroom','subject','teacher'])
            ->orderBy('teacher_id')
            ->orderBy('day_of_week')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id' => ['required','exists:users,id'],
            'day_of_week' => ['required','integer','between:1,5'],
            'timeslot_id' => ['required','exists:timeslots,id'],
            'classroom_id' => ['required','exists:classrooms,id'],
            'subject_id' => ['required','exists:subjects,id'],
        ]);

        return response()->json(ScheduleEntry::create($data), 201);
    }

    public function show(ScheduleEntry $schedule_entry)
    {
        return $schedule_entry->load(['timeslot','classroom','subject','teacher']);
    }

    public function update(Request $request, ScheduleEntry $schedule_entry)
    {
        $data = $request->validate([
            'teacher_id' => ['required','exists:users,id'],
            'day_of_week' => ['required','integer','between:1,5'],
            'timeslot_id' => ['required','exists:timeslots,id'],
            'classroom_id' => ['required','exists:classrooms,id'],
            'subject_id' => ['required','exists:subjects,id'],
        ]);

        $schedule_entry->update($data);
        return $schedule_entry->fresh()->load(['timeslot','classroom','subject','teacher']);
    }

    public function destroy(ScheduleEntry $schedule_entry)
    {
        $schedule_entry->delete();
        return response()->noContent();
    }

    // GET /v1/teachers/{teacher}/schedule/day?date=YYYY-MM-DD
    public function day(Request $request, User $teacher)
    {
        $data = $request->validate(['date' => ['required','date']]);
        $date = Carbon::parse($data['date'])->startOfDay();
        $dow = (int)$date->dayOfWeekIso;

        if ($dow > 5) {
            throw ValidationException::withMessages(['date' => 'Only Monday-Friday allowed']);
        }

        $entries = ScheduleEntry::query()
            ->where('teacher_id', $teacher->id)
            ->where('day_of_week', $dow)
            ->with(['timeslot','classroom','subject'])
            ->get();

        $absentTimeslotIds = Absence::query()
            ->where('teacher_id', $teacher->id)
            ->whereDate('date', $date->toDateString())
            ->pluck('timeslot_id')
            ->all();

        $rows = $entries->map(function ($e) use ($absentTimeslotIds) {
            return [
                'schedule_entry_id' => $e->id,
                'timeslot_id' => $e->timeslot_id,
                'start_time' => $e->timeslot->start_time,
                'end_time' => $e->timeslot->end_time,
                'classroom' => $e->classroom->name,
                'subject' => $e->subject->name,
                'is_absent' => in_array($e->timeslot_id, $absentTimeslotIds, true),
            ];
        })->values();

        return response()->json([
            'teacher' => ['id' => $teacher->id, 'name' => $teacher->name],
            'date' => $date->toDateString(),
            'day_of_week' => $dow,
            'entries' => $rows,
        ]);
    }
}
