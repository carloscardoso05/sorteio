import { ref, computed, readonly } from "vue";

export function useSorteador(initialMin: number = 1, initialMax: number = 100) {
  const min = ref(initialMin);
  const max = ref(initialMax);
  const sorteados = ref<number[]>([]);
  const erro = ref<string | null>(null);
  const comRepeticao = ref(true);

  validarLimites(initialMin, initialMax);

  function checkInteiro(v: number): void {
    if (!Number.isInteger(v)) {
      throw new Error("O valor deve ser um número inteiro.");
    }
  }

  function validarLimites(min: number, max: number): void {
    checkInteiro(min);
    checkInteiro(max);
    if (min >= max) {
      throw new Error("O valor mínimo deve ser menor que o valor máximo.");
    }
  }

  function toggleRepeticao(): void {
    comRepeticao.value = !comRepeticao.value;
  }

  function aleatorio(): number {
    return Math.floor(Math.random() * (max.value - min.value + 1)) + min.value;
  }

  function setMin(novoMin: number): void {
    try {
      validarLimites(novoMin, max.value);
      min.value = novoMin;
      resetErro();
    } catch (e) {
      setErro(e);
    }
  }

  function setMax(novoMax: number): void {
    try {
      validarLimites(min.value, novoMax);
      max.value = novoMax;
      resetErro();
    } catch (e) {
      setErro(e);
    }
  }

  function sortearComRepeticao(): number {
    const sorteado = aleatorio();
    sorteados.value.push(sorteado);
    resetErro();
    return sorteado;
  }

  function sortearSemRepeticao(): number | null {
    try {
      const totalPossivel = max.value - min.value + 1;
      if (new Set(sorteados.value).size >= totalPossivel) {
        throw new Error("Todos os números possíveis já foram sorteados.");
      }

      let sorteado: number;
      do {
        sorteado = aleatorio();
      } while (sorteados.value.includes(sorteado));

      sorteados.value.push(sorteado);
      resetErro();
      return sorteado;
    } catch (e) {
      setErro(e);
      return null;
    }
  }

  function sortear(): number | null {
    if (comRepeticao.value) {
      return sortearComRepeticao();
    } else {
      return sortearSemRepeticao();
    }
  }

  function reset(): void {
    sorteados.value = [];
    setMin(initialMin);
    setMax(initialMax);
    comRepeticao.value = true;
    resetErro();
  }

  function setErro(e: unknown): void {
    if (e instanceof Error) {
      erro.value = e.message;
    } else {
      erro.value = String(e);
    }
  }

  function resetErro(): void {
    erro.value = null;
  }

  return {
    min: readonly(min),
    max: readonly(max),
    comRepeticao: readonly(comRepeticao),
    sorteados: readonly(sorteados),
    ultimoSorteado: computed(() =>
      sorteados.value.length > 0
        ? sorteados.value[sorteados.value.length - 1]
        : null,
    ),
    erro: readonly(erro),
    setMin,
    setMax,
    sortear,
    reset,
    toggleRepeticao,
  };
}
