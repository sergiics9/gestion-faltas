<?php

namespace App\Http\Controllers\Api;

use App\Models\Absence;
use App\Models\ScheduleEntry;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GuardController
{
    public function today(Request $request)
    {
        $user = $request->user();
        $today = Carbon::parse($request->get('date', 'today'))->toDateString();
        $dow = (int) Carbon::parse($today)->dayOfWeekIso;

        $absences = Absence::query()
            ->whereDate('date', $today)
            ->whereHas('teacher', fn ($q) => $q->where('center_id', $user->center_id))
            ->with(['teacher', 'timeslot'])
            ->orderBy('timeslot_id')
            ->get();

        $rows = $absences->map(function ($a) use ($dow) {
            $entry = ScheduleEntry::query()
                ->where('teacher_id', $a->teacher_id)
                ->where('day_of_week', $dow)
                ->where('timeslot_id', $a->timeslot_id)
                ->with(['classroom', 'subject'])
                ->first();

            return [
                'id' => $a->id,
                'date' => $a->date,
                'start_time' => $a->timeslot->start_time,
                'end_time' => $a->timeslot->end_time,
                'teacher' => $a->teacher->name,
                'classroom' => $entry?->classroom?->name ?? '—',
                'subject' => $entry?->subject?->name ?? '—',
                'note' => $a->note,
            ];
        })->values()->all();

        return response()->json([
            'date' => $today,
            'absences' => $rows,
        ]);
    }
}
