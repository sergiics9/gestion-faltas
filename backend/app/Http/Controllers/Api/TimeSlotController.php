<?php

namespace App\Http\Controllers\Api;

use App\Models\TimeSlot;
use Illuminate\Http\Request;

class TimeSlotController
{
    public function index()
    {
        return TimeSlot::query()->orderBy('start_time')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'center_id' => ['required','exists:centers,id'],
            'start_time' => ['required'],
            'end_time' => ['required'],
        ]);

        return response()->json(TimeSlot::create($data), 201);
    }

    public function show(TimeSlot $timeslot) { return $timeslot; }

    public function update(Request $request, TimeSlot $timeslot)
    {
        $data = $request->validate([
            'center_id' => ['required','exists:centers,id'],
            'start_time' => ['required'],
            'end_time' => ['required'],
        ]);

        $timeslot->update($data);
        return $timeslot;
    }

    public function destroy(TimeSlot $timeslot)
    {
        $timeslot->delete();
        return response()->noContent();
    }
}
