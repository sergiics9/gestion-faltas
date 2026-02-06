<?php

namespace App\Http\Controllers\Api;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController
{
    public function index() { return Subject::query()->orderBy('name')->get(); }

    public function store(Request $request)
    {
        $data = $request->validate([
            'center_id' => ['required','exists:centers,id'],
            'name' => ['required','string','max:120'],
        ]);

        return response()->json(Subject::create($data), 201);
    }

    public function show(Subject $subject) { return $subject; }

    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'center_id' => ['required','exists:centers,id'],
            'name' => ['required','string','max:120'],
        ]);

        $subject->update($data);
        return $subject;
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->noContent();
    }
}
