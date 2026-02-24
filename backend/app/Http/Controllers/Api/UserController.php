<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController
{
    private function authorizeAdminCenter(Request $request, ?User $user = null): void
    {
        $auth = $request->user();
        if (! in_array($auth->role, ['admin', 'centeradmin'], true)) {
            abort(403, 'Forbidden');
        }
        if ($auth->role === 'centeradmin') {
            if ($user && $user->center_id !== $auth->center_id) {
                abort(403, 'Forbidden');
            }
        }
    }

    public function index(Request $request)
    {
        $this->authorizeAdminCenter($request);

        $query = User::query()->with('center:id,name');

        if ($request->user()->role === 'centeradmin') {
            $query->where('center_id', $request->user()->center_id);
        }

        if ($request->has('role')) {
            $query->where('role', $request->get('role'));
        }

        $users = $query->orderBy('name')->get()->map(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'username' => $u->username,
            'role' => $u->role,
            'center_id' => $u->center_id,
            'center' => $u->center?->name,
        ]);

        return response()->json(['data' => $users]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdminCenter($request);

        $auth = $request->user();
        $centerId = $auth->center_id;
        if ($auth->role === 'admin' && $request->has('center_id')) {
            $centerId = $request->input('center_id');
        }

        $data = $request->validate([
            'username' => ['required', 'string', 'max:60', 'unique:users,username'],
            'password' => ['required', 'string', Password::defaults()],
            'name' => ['required', 'string', 'max:120'],
            'role' => ['required', Rule::in(['admin', 'centeradmin', 'teacher', 'guard'])],
            'center_id' => ['nullable', 'exists:centers,id'],
        ]);

        if ($auth->role === 'centeradmin') {
            $data['center_id'] = $auth->center_id;
        } elseif (isset($data['center_id'])) {
            $data['center_id'] = $data['center_id'] ?: null;
        } else {
            $data['center_id'] = $centerId;
        }

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        $user->load('center:id,name');

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'role' => $user->role,
            'center_id' => $user->center_id,
            'center' => $user->center?->name,
        ], 201);
    }

    public function show(Request $request, User $user)
    {
        $this->authorizeAdminCenter($request, $user);
        $user->load('center:id,name');
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'role' => $user->role,
            'center_id' => $user->center_id,
            'center' => $user->center?->name,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorizeAdminCenter($request, $user);

        $data = $request->validate([
            'username' => ['sometimes', 'string', 'max:60', Rule::unique('users', 'username')->ignore($user->id)],
            'password' => ['nullable', 'string', Password::defaults()],
            'name' => ['sometimes', 'string', 'max:120'],
            'role' => ['sometimes', Rule::in(['admin', 'centeradmin', 'teacher', 'guard'])],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        $user->load('center:id,name');
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'role' => $user->role,
            'center_id' => $user->center_id,
            'center' => $user->center?->name,
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        $this->authorizeAdminCenter($request, $user);
        $user->delete();
        return response()->noContent();
    }
}
