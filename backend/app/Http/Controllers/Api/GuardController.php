<?php

namespace App\Http\Controllers\Api;

use App\Models\Absence;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GuardController
{
    public function today(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $rows = Absence::query()
            ->whereDate('date', $today)
            ->whereHas('teacher', fn ($q) => $q->where('center_id', $user->center_id))
            ->with(['teacher','timeslot'])
            ->orderBy('timeslot_id')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'date' => $a->date,
                    'start_time' => $a->timeslot->start_time,
                    'end_time' => $a->timeslot->end_time,
                    'teacher' => $a->teacher->name,
                    'note' => $a->note,
                ];
            });

        return response()->json([
            'date' => $today,
            'absences' => $rows,
        ]);
    }
}
