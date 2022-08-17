export default interface CountryInterface {
    name: {common: string, official: string, nativeName: {}};
    flag: string;
    population: number,
    region: string,
    capital: [string],
    subregion: string,
    tld: [string],
    currencies: {},
    languages: {}
    flags: {png: string, svg: string},
    cca3: string
    borders?: [string],
}