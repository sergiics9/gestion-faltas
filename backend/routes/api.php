<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\GuardController;
use App\Http\Controllers\Api\CenterController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\ScheduleEntryController;

Route::post('/v1/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/v1/auth/me', [AuthController::class, 'me']);
    Route::post('/v1/auth/logout', [AuthController::class, 'logout']);

    // CRUD
    Route::apiResource('/v1/centers', CenterController::class);
    Route::apiResource('/v1/timeslots', TimeSlotController::class);
    Route::apiResource('/v1/classrooms', ClassroomController::class);
    Route::apiResource('/v1/subjects', SubjectController::class);
    Route::apiResource('/v1/schedule-entries', ScheduleEntryController::class);

    // Absences
    Route::post('/v1/absences', [AbsenceController::class, 'store']);

    // Guard (login required)
    Route::get('/v1/guard/today', [GuardController::class, 'today']);

    // Schedule day view (for red cells)
    Route::get('/v1/teachers/{teacher}/schedule/day', [ScheduleEntryController::class, 'day']);
});
