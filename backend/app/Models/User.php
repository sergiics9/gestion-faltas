<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'center_id',
        'username',
        'password',
        'name',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    public function center() {
        return $this->belongsTo(Center::class);
    }

    public function scheduleEntries() {
        return $this->hasMany(ScheduleEntry::class, 'teacher_id');
    }

    public function absences() {
        return $this->hasMany(Absence::class, 'teacher_id');
    }
}
