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
          <div class="flex flex-col items-center gap-3 py-2">
            <div class="coin-scene">
              <div class="coin" :style="{ transform: `rotateY(${giro}deg)` }">
                <div class="coin-face coin-cara">
                  <svg viewBox="0 0 120 120" class="h-full w-full">
                    <defs>
                      <radialGradient id="gradCara" cx="35%" cy="30%" r="85%">
                        <stop offset="0%" stop-color="#ffe89a" />
                        <stop offset="45%" stop-color="#f6c644" />
                        <stop offset="100%" stop-color="#c98f1e" />
                      </radialGradient>
                    </defs>
                    <circle cx="60" cy="60" r="57" fill="url(#gradCara)" stroke="#a97a1a" stroke-width="2" />
                    <circle cx="60" cy="60" r="49" fill="none" stroke="#b8860b" stroke-width="2" stroke-dasharray="2 3" />
                    <circle cx="60" cy="60" r="18" fill="#8a5a14" />
                    <circle cx="53" cy="56" r="2.5" fill="#f6c644" />
                    <circle cx="67" cy="56" r="2.5" fill="#f6c644" />
                    <path d="M52 66 Q60 74 68 66" fill="none" stroke="#f6c644" stroke-width="3" stroke-linecap="round" />
                  </svg>
                </div>
                <div class="coin-face coin-coroa">
                  <svg viewBox="0 0 120 120" class="h-full w-full">
                    <defs>
                      <radialGradient id="gradCoroa" cx="35%" cy="30%" r="85%">
                        <stop offset="0%" stop-color="#ffe89a" />
                        <stop offset="45%" stop-color="#f6c644" />
                        <stop offset="100%" stop-color="#c98f1e" />
                      </radialGradient>
                    </defs>
                    <circle cx="60" cy="60" r="57" fill="url(#gradCoroa)" stroke="#a97a1a" stroke-width="2" />
                    <circle cx="60" cy="60" r="49" fill="none" stroke="#b8860b" stroke-width="2" stroke-dasharray="2 3" />
                    <path d="M40 80 L40 56 L50 64 L60 46 L70 64 L80 56 L80 80 Z" fill="#8a5a14" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="text-center">
              <p class="text-base-content">O resultado é</p>
              <p class="text-7xl font-black text-primary leading-tight">
                {{ resultadoCaraCoroa }}
              </p>
            </div>
          </div>

          <div class="flex justify-end">
            <button class="btn btn-ghost" @click="resetCaraCoroaCompleto">Limpar</button>
          </div>

          <button class="btn btn-primary btn-lg w-full" :disabled="flipando" @click="sortearCaraCoroaAnimado">
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
import type { Resultado } from "./cara_coroa";

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
  resultados: resultadosCaraCoroa,
  sortear: sortearCaraCoroa,
  reset: resetCaraCoroa,
} = useCaraCoroa();

const giro = ref(0);
const flipando = ref(false);
const resultadoExibido = ref<Resultado | null>(null);
let temporizadorFlip: number | undefined;

const resultadoCaraCoroa = computed(() =>
  resultadoExibido.value === null
    ? "—"
    : resultadoExibido.value === "cara"
      ? "Cara"
      : "Coroa",
);

function sortearCaraCoroaAnimado(): void {
  if (flipando.value) return;
  const resultado = sortearCaraCoroa();
  const voltaAtual = Math.round(giro.value / 180) % 2;
  const voltaAlvo = resultado === "cara" ? 0 : 1;
  giro.value += 720 + (voltaAlvo - voltaAtual) * 180;
  flipando.value = true;
  temporizadorFlip = window.setTimeout(() => {
    resultadoExibido.value = resultado;
    flipando.value = false;
  }, 2000);
}

function resetCaraCoroaCompleto(): void {
  if (temporizadorFlip !== undefined) {
    window.clearTimeout(temporizadorFlip);
    temporizadorFlip = undefined;
  }
  flipando.value = false;
  giro.value = 0;
  resultadoExibido.value = null;
  resetCaraCoroa();
}

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

<style scoped>
.coin-scene {
  perspective: 800px;
}

.coin {
  position: relative;
  width: 8rem;
  height: 8rem;
  transform-style: preserve-3d;
  transition: transform 2s cubic-bezier(0.22, 0.61, 0.36, 1);
  animation: coin-bob 3s ease-in-out infinite;
}

.coin-face {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  overflow: hidden;
  box-shadow:
    inset 0 0 12px rgba(0, 0, 0, 0.25),
    0 8px 16px rgba(0, 0, 0, 0.3);
}

.coin-cara {
  transform: rotateY(0deg);
}

.coin-coroa {
  transform: rotateY(180deg);
}

@keyframes coin-bob {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -8px;
  }
}
</style>
