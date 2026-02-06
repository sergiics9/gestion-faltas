<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    protected $fillable = [
        'teacher_id',
        'timeslot_id',
        'date',
        'note'
    ];

    public function teacher() {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function timeslot() {
        return $this->belongsTo(TimeSlot::class);
    }
}
