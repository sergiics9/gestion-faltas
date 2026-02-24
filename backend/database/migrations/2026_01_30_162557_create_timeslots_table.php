<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('timeslots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('center_id')->constrained('centers')->cascadeOnDelete();
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();

            $table->index(['center_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timeslots');
    }
};
