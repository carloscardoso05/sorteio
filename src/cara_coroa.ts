import { computed, readonly, ref } from "vue";

export function useCaraCoroa() {
  const resultados = ref<Resultado[]>([]);

  function sortear(): Resultado {
    const resultado = Math.random() < 0.5 ? "cara" : "coroa";
    resultados.value.push(resultado);
    return resultado;
  }

  function reset() {
    resultados.value = [];
  }

  return {
    resultados: readonly(resultados),
    ultimoSorteado: computed(
      () => resultados.value[resultados.value.length - 1] || null,
    ),
    sortear,
    reset,
  };
}

export type Resultado = "cara" | "coroa";
