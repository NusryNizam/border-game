import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CountryInterface from '../interfaces/Country.interface'
import '../styles/Question.css'

// interface QuestionProps {
//     children?: JSX.Element|JSX.Element[] | ReactNode | ReactNode[];
// }
export const Question: React.FC = () => {
    let [countries, setCountries] = useState<CountryInterface[] | []>([])
    let [err, setErr] = useState<string>('')

    let [randomCountry, setRandomCountry] = useState<CountryInterface | null>(null)
    let [answer, setAnswer] = useState<string>('')
    let [otherOptions, setOtherOptions] = useState<string[]>([])

    let [isCorrect, setIsCorrect] = useState<boolean | null>(null)

    // let [borderCountry, setBorderCountry] = useState<CountryInterface | null>(null)
    // let [borders, setBorders] = useState<string>()

    let randomIndex = getRandomIndex();

    const getCountries = () => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(res => {
                setCountries(res.data) // Array of 250 CountryInterface objects
                console.log('Countries fetched!');

                let data = res.data


                selectRandomCountry(data)
                // Shuffle the index to omit the countries without borders
                // while (!res.data[randomIndex].borders) {
                //     randomIndex = getRandomIndex()
                //     console.warn(`Shuffling countries: ${randomIndex}`)
                // }

                // // Now the random index points to a country with a border

                // let selectedCountry = res.data[randomIndex]

                // setRandomCountry(selectedCountry)
                // console.log(`Selected country (with borders): ${selectedCountry.name.common}`)
                // console.log(`Borders of ${selectedCountry.name.common}: ${selectedCountry.borders}`)

                // // generateOptions(selectedCountry.borders);                    


                // let borderLength = selectedCountry.borders.length - 1
                // let randomNum = Math.round(Math.random() * borderLength) // Random number to select a border country
                // let randomBorder = selectedCountry.borders[randomNum]

                // // setBorders(randomBorder)
                // getBorderCountry(randomBorder)
            })
            .catch(err => {
                setErr(err.message)
                console.error(err)
                console.error('Failed to fetch countries.');
            })
    }

    const selectRandomCountry = (data: CountryInterface[]) => {
        // Shuffle the index to omit the countries without borders
        while (!data[randomIndex].borders) {
            randomIndex = getRandomIndex()
            console.warn(`Shuffling countries: ${randomIndex}`)
        }

        // Now the random index points to a country with a border

        let selectedCountry = data[randomIndex]

        setRandomCountry(selectedCountry)
        console.log(`SELECTED COUNTRY WITH BORDERS: ${selectedCountry.name.common}`)
        console.log(`BORDERS OF ${selectedCountry.name.common}: ${selectedCountry.borders}`)
        console.log(selectedCountry.borders);

        let randomBorder = ''
        if (selectedCountry?.borders) {
            let borderLength = selectedCountry.borders.length - 1
            let randomNum = Math.round(Math.random() * borderLength) // Random number to select a border country
            randomBorder = selectedCountry.borders[randomNum]
        }

        // setBorders(randomBorder)
        getBorderCountry(randomBorder)
    }

    const generateOptions = (borders: string[]) => {
        // Generate altenate answers that are not borders of the main selected country
        let arr: string[] = []
        let rand = getRandomIndex()

        while (arr.length < 3) {
            borders.map(border => {
                console.log(`CCA3: ${countries[rand].cca3} --- Border CCA3: ${border}`)
                while (countries[rand].cca3 === border) {
                    rand = getRandomIndex()
                    console.warn('Shuffling')
                }
                if (arr.length < 3) {
                    arr.push(countries[rand].name.common)
                    rand = getRandomIndex()
                }

                return null
            })
        }

        console.log(`Other options: ${arr}`)

        return arr
    }

    const getBorderCountry = (randomBorder: string) => {
        // Function to get the full country name of the cca code.
        axios.get(`https://restcountries.com/v3.1/alpha?codes=${randomBorder.toLowerCase()}`)
            .then((res) => {
                // setBorderCountry(res.data[0]);
                setAnswer(res.data[0].name.common)
                setOtherOptions(prev => {
                    let newArr = []
                    for (let i = 0; i < 3; i++) {
                        newArr.push(prev[i])
                    }
                    console.log('New Arr');
                    console.log(newArr);

                    return [...prev, res.data[0].name.common]
                })
                console.log('Border country fetched!');
                console.log(`Border country name: ${res.data[0].name.common}`)
            })
            .then(() => {
                setOtherOptions(prev => [...shuffle(prev)])
            })
            .catch(err => {
                console.log('Couldn\'t fetch border country')
                console.error(err.message)
            })
    }


    function getRandomIndex(): number {
        return Math.round(Math.random() * 250)
    }

    function shuffle(array: string[]) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(e.target.value)
        if (answer === e.target.value) {
            console.log('Correct!');
            setIsCorrect(true)
        } else {
            setIsCorrect(false)
        }
    }

    useEffect(() => {
        getCountries();
    }, [])

    useEffect(() => {
        if (randomCountry) {
            setOtherOptions(prev => [...prev, ...generateOptions(randomCountry?.borders as string[])]);
        }

    }, [randomCountry])

    useEffect(() => {
        console.log('running...');

        setTimeout(() => {
            if (isCorrect != null) {
                setRandomCountry(null)
                setAnswer('')
                setIsCorrect(null)
                setOtherOptions([])
                // getCountries()
                // setRandomCountry(countries[randomIndex])
                selectRandomCountry(countries)
            }
        }, 1500)
    }, [isCorrect])

    return (randomCountry ?
        (<div className="center">
            <img className='flag' src={randomCountry.flags.png} alt="" />
            <h2 className='heading'>Which country borders {randomCountry.name.common}?</h2>
            <div className="options">
                <>
                    {/* <input
                        type="radio" name="countries"
                        id={borderCountry?.name.common}
                        value={borderCountry?.name.common}
                        onChange={(e) => { console.log(e.target.value) }} />

                    <label
                        htmlFor={borderCountry?.name.common}
                        className='country-label'>
                        {borderCountry?.name.common}
                    </label> */}

                    {
                        otherOptions && otherOptions.length === 4 && otherOptions.map((option, index) => {
                            if (index < 4) {
                                return (<div key={option}>
                                    <input
                                        type="radio"
                                        name="countries"
                                        id={option}
                                        value={option}
                                        onChange={(e) => { handleSelection(e) }} />

                                    <label
                                        htmlFor={option}
                                        className='country-label'>
                                        {option}
                                    </label>
                                </div>)
                            }

                            return null
                        })
                    }
                </>
            </div>
            <div>{ }</div>
            <div className={isCorrect === null ? 'not-chosen placeholder' : '' || isCorrect ? 'placeholder correct' : ' placeholder wrong'}>{isCorrect === null ? 'Choose your answer' : isCorrect ? 'Correct!' : 'Wrong answer!'}</div>
        </div>)
        : //else
        <div className='center'><h2>Loading...</h2></div>
    )
}