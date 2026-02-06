<?php

namespace Database\Seeders;

use App\Models\Center;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\TimeSlot;
use App\Models\Classroom;
use App\Models\Subject;
use Carbon\Carbon;


class InicialDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Center
        $center = Center::firstOrCreate(
            ['name' => 'IES Ejemplo'],
            []
        );

        // 2) Admin user
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'center_id' => $center->id,
                'name'      => 'Administrador',
                'password'  => Hash::make('Admin123!'),
                'role'      => 'admin',
            ]
        );

        // Timeslots example
        $times = [
            ['08:30', '09:25'],
            ['09:25', '10:20'],
            ['10:20', '11:15'],
        ];

        foreach ($times as [$start, $end]) {
            TimeSlot::firstOrCreate([
                'center_id'   => $center->id,
                'start_time'  => $start,
                'end_time'    => $end,
            ]);
        }

        // Classrooms example
        Classroom::firstOrCreate([
            'center_id' => $center->id,
            'name'      => 'Aula 101',
        ]);

        // Subjects example
        Subject::firstOrCreate([
            'center_id' => $center->id,
            'name'      => 'Matemáticas 1 ESO',
        ]);
    }
}
