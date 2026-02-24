<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeSlot extends Model
{
    use HasFactory;

    protected $table = 'timeslots';

    protected $fillable = [
        'center_id',
        'start_time',
        'end_time',
    ];

    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    public function scheduleEntries()
    {
        return $this->hasMany(ScheduleEntry::class);
    }

    public function absences()
    {
        return $this->hasMany(Absence::class);
    }
}
