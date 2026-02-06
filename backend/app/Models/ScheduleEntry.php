<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleEntry extends Model
{
    protected $fillable = [
        'teacher_id',
        'day_of_week',
        'timeslot_id',
        'classroom_id',
        'subject_id'
    ];

    public function teacher() {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function timeslot() {
        return $this->belongsTo(TimeSlot::class);
    }

    public function classroom() {
        return $this->belongsTo(Classroom::class);

    }

    public function subject() {
        return $this->belongsTo(Subject::class);
    }
}
