import Decimal from "decimal.js";
import { XAI_DECIMAIL } from "./chain.custom";
import { toast } from "react-toastify";
import { formatUnits } from "viem";
import { MYSTERY_BOX_EVENT_SIGNATURE } from "@/types/common";
import { format } from "date-fns";
import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export function TruncateMiddle(
  value: string,
  frontStringToKeep = 4,
  backStringToKeep = 5
): string {
  if (value.length <= frontStringToKeep + backStringToKeep) {
    return value;
  }

  const front = value.slice(0, frontStringToKeep);
  const back = value.slice(value.length - backStringToKeep);
  return `${front}...${back}`;
}

export const enoughBalance = (
  balance: bigint,
  fee: bigint,
  decimal?: number
) => {
  const _balance = new Decimal(formatUnits(balance, decimal || XAI_DECIMAIL));
  const _fee = new Decimal(formatUnits(fee, decimal || XAI_DECIMAIL));
  if (_fee.greaterThan(_balance)) {
    toast("Not enough balance!", { type: "error" });
    return false;
  }
  return true;
};

export const enoughGasPrice = (
  balance: bigint,
  fee: bigint | null,
  gasPrice: bigint
) => {
  const _balance = new Decimal(formatUnits(balance, XAI_DECIMAIL));
  const _fee = new Decimal(fee === null ? "0" : formatUnits(fee, XAI_DECIMAIL));
  const _gasPrice = new Decimal(formatUnits(gasPrice, XAI_DECIMAIL));
  if (_fee.add(_gasPrice).greaterThan(_balance)) {
    toast("Not enough gas!", { type: "error" });
    return false;
  }
  return true;
};

export const getNftIdFromLogs = (logs: any[]) => {
  return logs
    .filter((z) => z.topics[0] === MYSTERY_BOX_EVENT_SIGNATURE && !!z.topics[3])
    .map((j) => Number(j.topics[3]));
};

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat("en-US").format(amount);
};

export const fibonacciNumbersSum = (n: number) => {
  let a = 0;
  let b = 1;
  let sum = 0;
  let fibonacciNumbers = [];

  // Tính tổng các số Fibonacci cho đến khi tổng vượt qua hoặc bằng n
  while (sum <= n) {
    fibonacciNumbers.push(a);
    let temp = a + b;
    a = b;
    b = temp;
    sum += a;
  }

  if (fibonacciNumbers.reduce((acc, currentValue) => acc + currentValue, 0) < n)
    fibonacciNumbers.push(
      fibonacciNumbers[fibonacciNumbers.length - 1] +
        fibonacciNumbers[fibonacciNumbers.length - 2]
    );

  return fibonacciNumbers;
};

export const FormatNumber = (num:number) => {
  return Intl.NumberFormat('en-US', { maximumSignificantDigits: 8 }).format(num);
}

export const FormatBigNumber = (num: string) => {
  const n = num.split(".")
  const first = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  if (n.length > 1) return `${first}.${n[1]}`;
  return first
}

export function truncateAddress(str: string | undefined, index?: number) {
  const idx = index || 4;
  if (!str) return "";
  return `${str.slice(0, 5) }...${str.slice(str.length - idx)}`;
}

export const logErrorToFirestore = async (error: any) => {
  const now = new Date()
  const time = now.toISOString()
  const collectionName = `errors (${format(now, 'MM-dd-yyyy')})`

  const errorData = {
    ...error,
    type: 'soby-website',
  }

  await setDoc(doc(db, collectionName, time), errorData)
}

export function formatLargeNumber (number: string){
  let num = Number(number);
  const suffixes = ['', '', 'M', 'B', 'T', 'Q', 'Qa', 'Qi', 'Sx'];
  let suffixIndex = 0;
  while (Math.abs(num) >= 1000 && suffixIndex < suffixes.length - 1) {
      num /= 1000;
      suffixIndex++;
  }

  if (suffixes[suffixIndex] === '') {
    return FormatBigNumber(number);
  }

  return num.toFixed(1) + suffixes[suffixIndex];
}