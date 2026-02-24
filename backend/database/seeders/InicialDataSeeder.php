<?php

namespace Database\Seeders;

use App\Models\Center;
use App\Models\User;
use App\Models\TimeSlot;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\ScheduleEntry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InicialDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Centro
        $center = Center::firstOrCreate(
            ['name' => 'IES Pere Maria'],
            []
        );

        // 2) Usuarios por rol (para probar login y vistas)
        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'center_id' => $center->id,
                'name'      => 'Administrador',
                'password'  => Hash::make('Admin123!'),
                'role'      => 'admin',
            ]
        );

        $guard = User::firstOrCreate(
            ['username' => 'guardia'],
            [
                'center_id' => $center->id,
                'name'      => 'Profesor Guardia',
                'password'  => Hash::make('Guardia123!'),
                'role'      => 'guard',
            ]
        );

        $teacher = User::firstOrCreate(
            ['username' => 'profesor'],
            [
                'center_id' => $center->id,
                'name'      => 'María García',
                'password'  => Hash::make('Profe123!'),
                'role'      => 'teacher',
            ]
        );

        // 3) Franjas horarias
        $times = [
            ['08:30', '09:25'],
            ['09:25', '10:20'],
            ['10:20', '11:15'],
            ['11:45', '12:40'],
            ['12:40', '13:35'],
        ];
        foreach ($times as [$start, $end]) {
            TimeSlot::firstOrCreate([
                'center_id'  => $center->id,
                'start_time' => $start,
                'end_time'   => $end,
            ], []);
        }
        $timeslots = TimeSlot::where('center_id', $center->id)->orderBy('start_time')->get();

        // 4) Aulas y asignaturas
        $aula101 = Classroom::firstOrCreate([
            'center_id' => $center->id,
            'name'      => 'Aula 101',
        ], []);

        $aula102 = Classroom::firstOrCreate([
            'center_id' => $center->id,
            'name'      => 'Aula 102',
        ], []);

        $mates = Subject::firstOrCreate([
            'center_id' => $center->id,
            'name'      => 'Matemáticas 1 ESO',
        ], []);

        $lengua = Subject::firstOrCreate([
            'center_id' => $center->id,
            'name'      => 'Lengua 1 ESO',
        ], []);

        // 5) Horario del profesor (entradas para poder ver clases y registrar faltas)
        // Lunes: 1ª y 2ª hora en Aula 101 (Matemáticas) y 3ª en Aula 102 (Lengua)
        // Martes: 1ª hora Aula 101 Matemáticas
        $slots = $timeslots; // [0]=1ª, [1]=2ª, etc.
        $entries = [
            ['teacher' => $teacher, 'day' => 1, 'slot_index' => 0, 'classroom' => $aula101, 'subject' => $mates],
            ['teacher' => $teacher, 'day' => 1, 'slot_index' => 1, 'classroom' => $aula101, 'subject' => $mates],
            ['teacher' => $teacher, 'day' => 1, 'slot_index' => 2, 'classroom' => $aula102, 'subject' => $lengua],
            ['teacher' => $teacher, 'day' => 2, 'slot_index' => 0, 'classroom' => $aula101, 'subject' => $mates],
        ];
        foreach ($entries as $e) {
            ScheduleEntry::firstOrCreate([
                'teacher_id'   => $e['teacher']->id,
                'day_of_week'  => $e['day'],
                'timeslot_id'  => $slots[$e['slot_index']]->id,
                'classroom_id' => $e['classroom']->id,
                'subject_id'   => $e['subject']->id,
            ], []);
        }
    }
}
