export default function convertToSubcurreny(amount: number, factor = 100){
    return Math.round(amount * factor)
}

