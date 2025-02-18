import useFetchData from './useFetchData.ts'
import { useSuspenseQuery, UseSuspenseQueryResult } from '@tanstack/react-query'

export type SpecFrequencyReport = {
    keystoneLevel: number
    arcane: number
    fire: number
    frostMage: number
    holyPaladin: number
    protectionPaladin: number
    retribution: number
    arms: number
    fury: number
    protectionWarrior: number
    balance: number
    feral: number
    guardian: number
    restorationDruid: number
    blood: number
    frostDeathKnight: number
    unholy: number
    beastMastery: number
    marksmanship: number
    survival: number
    discipline: number
    holyPriest: number
    shadow: number
    assassination: number
    outlaw: number
    subtlety: number
    elemental: number
    enhancement: number
    restorationShaman: number
    affliction: number
    demonology: number
    destruction: number
    brewmaster: number
    windwalker: number
    mistweaver: number
    havoc: number
    vengeance: number
    devastation: number
    preservation: number
    augmentation: number
}

export const useGetSpecFrequency = (): UseSuspenseQueryResult<SpecFrequencyReport[]> => {
    return useSuspenseQuery<SpecFrequencyReport[]>({
        queryKey: ['SpecFrequency'],
        queryFn: () => useFetchData<SpecFrequencyReport[]>('spec-frequency'),
    })
}
