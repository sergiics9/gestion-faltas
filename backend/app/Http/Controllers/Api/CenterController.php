<?php

namespace App\Http\Controllers\Api;

use App\Models\Center;
use Illuminate\Http\Request;

class CenterController
{
    public function index() { return Center::query()->orderBy('name')->get(); }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => ['required','string','max:120']]);
        return response()->json(Center::create($data), 201);
    }

    public function show(Center $center) { return $center; }

    public function update(Request $request, Center $center)
    {
        $data = $request->validate(['name' => ['required','string','max:120']]);
        $center->update($data);
        return $center;
    }

    public function destroy(Center $center)
    {
        $center->delete();
        return response()->noContent();
    }
}
