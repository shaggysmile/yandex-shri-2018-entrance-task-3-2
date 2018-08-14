import EnergyCost from '../EnergyCost'
import input from '../../data/input'
import output from '../../data/output'

describe('EnergyCost', () => {
  const energyCost = new EnergyCost(input)

  it('EnergyCost has constructor', () => {
    expect(EnergyCost).toBeDefined()
    expect(energyCost).toBeInstanceOf(EnergyCost)
  })

  it('Sort devices by duration', () => {
    const sortedDevices = energyCost.devices
    expect(sortedDevices[0]['id']).toEqual('7D9DC84AD110500D284B33C82FE6E85E')
    expect(sortedDevices[3]['id']).toEqual('02DDD23A85DADDD71198305330CC386D')
  })

  it('Correct fill rates', () => {
    const sortedRates = energyCost.rates
    expect(sortedRates.slice(0, 7)).toEqual(Array(7).fill(1.79))
    expect(sortedRates.slice(7, 10)).toEqual(Array(3).fill(6.46))
    expect(sortedRates.slice(10, 17)).toEqual(Array(7).fill(5.38))
    expect(sortedRates.slice(17, 21)).toEqual(Array(4).fill(6.46))
    expect(sortedRates.slice(21, 23)).toEqual(Array(2).fill(5.38))
    expect(sortedRates.slice(23)).toEqual(Array(1).fill(1.79))
  })

  it('Calc best sequence hour and cost by device', () => {
    const {sequence, cost} = energyCost.getSequence(input.devices[0])
    expect(sequence).toEqual(23)
    expect(cost).toEqual(1.79)
  })

  it('Test final output', () => {
    const result = energyCost.output()
    expect(result).toEqual(output)
  })
})
