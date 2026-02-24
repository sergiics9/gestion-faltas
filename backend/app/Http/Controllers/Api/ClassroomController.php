<?php

namespace App\Http\Controllers\Api;

use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomController
{
    public function index() { return Classroom::query()->orderBy('name')->get(); }

    public function store(Request $request)
    {
        $data = $request->validate([
            'center_id' => ['required','exists:centers,id'],
            'name' => ['required','string','max:60'],
        ]);

        return response()->json(Classroom::create($data), 201);
    }

    public function show(Classroom $classroom) { return $classroom; }

    public function update(Request $request, Classroom $classroom)
    {
        $data = $request->validate([
            'center_id' => ['required','exists:centers,id'],
            'name' => ['required','string','max:60'],
        ]);

        $classroom->update($data);
        return $classroom;
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return response()->noContent();
    }
}
