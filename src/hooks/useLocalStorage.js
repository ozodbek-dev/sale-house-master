import { useState, useEffect } from "react"

const getLocalValue = (key, initialValue) => {
	if (typeof window === "undefined") return initialValue
	const localValue = JSON.parse(localStorage.getItem(key))
	if (localValue) return localValue
	if (initialValue instanceof Function) return initialValue()
	return initialValue
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const useLocalStorage = (key, initialValue) => {
	const [value, setValue] = useState(() => getLocalValue(key, initialValue))

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value, getCircularReplacer()))
	}, [key, value])

	return [value, setValue]
}

export default useLocalStorage
