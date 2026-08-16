<template>
  <main class="min-h-dvh flex items-center justify-center bg-base-200 p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body gap-4">
        <h1 class="card-title justify-center text-2xl">Sorteio</h1>

        <div role="tablist" class="tabs tabs-box justify-evenly">
          <button role="tab" class="tab" :class="{ 'tab-active': modo === 'sorteio' }" @click="modo = 'sorteio'">
            Sorteador
          </button>
          <button role="tab" class="tab" :class="{ 'tab-active': modo === 'caraCoroa' }" @click="modo = 'caraCoroa'">
            Cara ou Coroa
          </button>
        </div>

        <div v-if="erro" class="alert alert-error py-2">
          <span>{{ erro }}</span>
        </div>

        <template v-if="modo === 'sorteio'">
          <div class="flex gap-2">
            <label class="flex-1">
              <span class="label-text text-sm mb-1 inline-block">Mínimo</span>
              <input type="number" class="input input-bordered w-full" :value="min" @change="onMinChange" />
            </label>
            <label class="flex-1">
              <span class="label-text text-sm mb-1 inline-block">Máximo</span>
              <input type="number" class="input input-bordered w-full" :value="max" @change="onMaxChange" />
            </label>
          </div>

          <div class="text-center py-2">
            <p class="text-base-content">O número sorteado é</p>
            <p class="text-7xl font-black text-primary leading-tight">
              {{ ultimoSorteado ?? "—" }}
            </p>
          </div>

          <div class="flex items-center justify-between gap-2">
            <label class="flex cursor-pointer items-center gap-2">
              <input type="checkbox" class="checkbox" :checked="comRepeticao" @change="toggleRepeticao" />
              <span class="label-text">Com repetição</span>
            </label>
            <button class="btn btn-ghost" @click="resetSorteador">Limpar</button>
          </div>

          <button class="btn btn-primary btn-lg w-full" @click="sortear">Sortear</button>

          <div v-if="sorteados.length > 0">
            <p class="label-text text-sm mb-1">Números sorteados ({{ sorteados.length }})</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="(n, i) in sorteados" :key="i" class="badge badge-ghost badge-lg">
                {{ n }}
              </span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="text-center py-2">
            <p class="text-base-content">O resultado é</p>
            <p class="text-7xl font-black text-primary leading-tight">
              {{ resultadoCaraCoroa }}
            </p>
          </div>

          <div class="flex justify-end">
            <button class="btn btn-ghost" @click="resetCaraCoroa">Limpar</button>
          </div>

          <button class="btn btn-primary btn-lg w-full" @click="sortearCaraCoroa">
            Sortear
          </button>

          <div v-if="resultadosCaraCoroa.length > 0">
            <p class="label-text text-sm mb-1">
              Resultados ({{ resultadosCaraCoroa.length }})
            </p>
            <div class="flex flex-wrap gap-1">
              <span v-for="(r, i) in resultadosCaraCoroa" :key="i" class="badge badge-ghost badge-lg">
                {{ r === "cara" ? "Cara" : "Coroa" }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSorteador } from "./sorteador";
import { useCaraCoroa } from "./cara_coroa";

type Modo = "sorteio" | "caraCoroa";

const modo = ref<Modo>("sorteio");

const {
  min,
  max,
  comRepeticao,
  sorteados,
  ultimoSorteado,
  erro,
  setMin,
  setMax,
  sortear,
  reset: resetSorteador,
  toggleRepeticao,
} = useSorteador(0, 100);

const {
  ultimoSorteado: ultimoCaraCoroa,
  resultados: resultadosCaraCoroa,
  sortear: sortearCaraCoroa,
  reset: resetCaraCoroa,
} = useCaraCoroa();

const resultadoCaraCoroa = computed(() =>
  ultimoCaraCoroa.value === null ? "—" : ultimoCaraCoroa.value === "cara" ? "Cara" : "Coroa",
);

function onMinChange(e: Event): void {
  const valor = Number((e.target as HTMLInputElement).value);
  if (!Number.isNaN(valor)) {
    setMin(valor);
  }
}

function onMaxChange(e: Event): void {
  const valor = Number((e.target as HTMLInputElement).value);
  if (!Number.isNaN(valor)) {
    setMax(valor);
  }
}
</script>
