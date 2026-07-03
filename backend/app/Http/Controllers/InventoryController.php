<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        return Inventory::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $payload = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string|max:500'
        ]);

        $inventory = Inventory::create($payload);

        return response()->json($inventory, 201);
    }
}
