import React from 'react'
import ReactDOM from 'react-dom'
import Chart from '../Chart/Chart'
import './styles.scss'

class Ranking extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countriesIndex: [0, 1],
            rankingIndex: 0
        }
    }

    componentWillMount() {
        this.sortCountries()
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps
        // ReactDOM.findDOMNode(this).querySelector('select').value = ''
        ReactDOM.findDOMNode(this).querySelectorAll('input').forEach((el, i) => el.value = this.props.countries[this.state.countriesIndex[i]].name)

        this.setState({
            countriesIndex: [0, 1]
        })
        this.sortCountries()
        
    }

    sortCountries = () => {
        const countries = [...this.props.countries]
        let ranking = countries.sort(function(a, b) {
            return parseFloat(b.medals.gold) - parseFloat(a.medals.gold)
        }).slice(0,10)
        
        this.setState({
            countries: ranking
        })
    }


    selectSport = (event, female = false) => {
        
        const selectedSport = event.target.value !== 'all' ? parseFloat(event.target.value) : 'all'
        if(event.target.value === 'all') {
            this.sortCountries()
        } else {
            if(!female) {
                let filteredCountries = this.props.countries.map(country => {
                    let selectedCountry = {}
                    selectedCountry.results = country.results.filter(result => result.sportId === selectedSport)
                    selectedCountry.name = country.name
                    selectedCountry.flag = country.flag
                    let medalCount = {
                        gold: 0,
                        silver: 0,
                        bronze: 0,
                        total: 0
                    }
                    selectedCountry.results.forEach(result => {
                        medalCount.gold = medalCount.gold + result.male.gold + result.female.gold + result.neutral.gold
                        medalCount.silver = medalCount.silver + result.male.silver + result.female.silver + result.neutral.silver
                        medalCount.bronze = medalCount.bronze + result.male.bronze + result.female.bronze + result.neutral.bronze
                    })
                    medalCount.total = medalCount.gold + medalCount.silver + medalCount.bronze
                    selectedCountry.medals = medalCount
                    return selectedCountry
                })
        
                let rankingBySport = filteredCountries.sort((a, b) => (b.medals.gold - a.medals.gold || b.medals.silver - a.medals.silver || b.medals.bronze - a.medals.bronze)).slice(0,10)
        
                this.setState({
                    countries: rankingBySport
                })
            } else {
                let filteredCountries = this.props.countries.map(country => {
                    let selectedCountry = {}
                    selectedCountry.results = country.results.filter(result => result.sportId === selectedSport)
                    selectedCountry.name = country.name
                    selectedCountry.flag = country.flag
                    let medalCount = {
                        gold: 0,
                        silver: 0,
                        bronze: 0,
                        total: 0
                    }
                    selectedCountry.results.forEach(result => {
                        medalCount.gold = medalCount.gold + result.female.gold
                        medalCount.silver = medalCount.silver + result.female.silver + result.neutral.silver
                        medalCount.bronze = medalCount.bronze + result.female.bronze + result.neutral.bronze
                    })
                    medalCount.total = medalCount.gold + medalCount.silver + medalCount.bronze
                    selectedCountry.medals = medalCount
                    return selectedCountry
                })
                let rankingBySport = filteredCountries.sort((a, b) => (b.medals.gold - a.medals.gold || b.medals.silver - a.medals.silver || b.medals.bronze - a.medals.bronze)).slice(0,10)
        
        
                this.setState({
                    countries: rankingBySport
                })
            }
        }
    }

    renderRanking = (index) => {
        switch(index) {
            case 0:
                return(
                    <div>
                        <div className="Ranking_sports_selector">
                            <label htmlFor="sportSelect">Filter le tableau des médailles par discipline :</label>
                            <select name="sportSelect" defaultValue="all" id="" onChange={this.selectSport}>
                                <option value="all">Tous</option>
                                {
                                    this.props.sports.map((sport, key) => (
                                        <option key={key} value={sport.id}>{sport.sport_name}</option>
                                    ))
                                }
                            </select>
                            <div></div>
                        </div>
                        <div className="Ranking_table_rows">
                            <div className="Ranking_table_rows_legend">
                                <div className="name">
                                    <p>Pays</p>
                                </div>
                                <div className="medals">
                                    <div className="medals_container">
                                        <div className="goldMedal"></div>
                                    </div>
                                    <div className="medals_container">
                                        <div className="silverMedal"></div>
                                    </div>
                                    <div className="medals_container">
                                        <div className="bronzeMedal"></div>
                                    </div>
                                    <p className="medals_container">Total</p>
                                </div>
                            </div>
                            {
                                this.state.countries.map((country, key) => {
                                    let gold = 0
                                    let silver = 0
                                    let bronze = 0
                                    
                                    country.results.forEach(result => {
                                        gold = gold + result.male.gold + result.female.gold + result.neutral.gold
                                        silver = silver + result.male.silver + result.female.silver + result.neutral.silver
                                        bronze = bronze + result.male.bronze + result.female.bronze + result.neutral.bronze
                                    })

                                    return(
                                        <div className="Ranking_table_rows_item" key={key}>
                                            <div className="name">
                                                <p>
                                                    <span className="rank">{key + 1}</span> 
                                                    <img src={country.flag} alt=""/>
                                                    {country.name}
                                                </p>
                                            </div>
                                            <div className="medals">
                                                <p className="gold">{gold}</p>
                                                <p className="silver">{silver}</p>
                                                <p className="bronze">{bronze}</p>
                                                <p>{gold + silver + bronze}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            case 1:
                return(
                    <div>
                        <div className="Ranking_sports_selector">
                            <label htmlFor="sportSelect">Filter le tableau des médailles par discipline :</label>
                            <select name="sportSelect" defaultValue="all" id="" onChange={(event) => this.selectSport(event, true)}>
                                <option value="all">Tous</option>
                                {
                                    this.props.sports.map((sport, key) => (
                                        <option key={key} value={sport.id}>{sport.sport_name}</option>
                                    ))
                                }
                            </select>
                            <div></div>
                        </div>
                        <div className="Ranking_table_rows">
                            <div className="Ranking_table_rows_legend">
                                <div className="name">
                                    <p>Pays</p>
                                </div>
                                <div className="medals">
                                    <div className="medals_container">
                                        <div className="goldMedal"></div>
                                    </div>
                                    <div className="medals_container">
                                        <div className="silverMedal"></div>
                                    </div>
                                    <div className="medals_container">
                                        <div className="bronzeMedal"></div>
                                    </div>
                                    <p className="medals_container">Total</p>
                                </div>
                            </div>
                            {
                                this.state.countries.map((country, key) => {
                                    let gold = 0
                                    let silver = 0
                                    let bronze = 0
                                    
                                    country.results.forEach(result => {
                                        gold = gold + result.female.gold
                                        silver = silver + result.female.silver
                                        bronze = bronze + result.female.bronze
                                    })

                                    return(
                                        <div className="Ranking_table_rows_item" key={key}>
                                            <div className="name">
                                                <p>
                                                    <span className="rank">{key + 1}</span> 
                                                    <img src={country.flag} alt=""/>
                                                    {country.name}
                                                </p>
                                            </div>
                                            <div className="medals">
                                                <p className="gold">{gold}</p>
                                                <p className="silver">{silver}</p>
                                                <p className="bronze">{bronze}</p>
                                                <p>{gold + silver + bronze}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            default:
                break;
        }
    }

    changeChart = (event) => {
        let countryInput = event.target.value
        this.props.countries.forEach((country, i) => {
            if(countryInput === country.name) {
                if(parseFloat(event.target.dataset.label) === 0) {
                    let currentIndex = this.state.countriesIndex[1]
                    this.setState({
                        countriesIndex: [i, currentIndex]
                    })
                } else {
                    let currentIndex = this.state.countriesIndex[0]
                    this.setState({
                        countriesIndex: [currentIndex, i]
                    })
                }
            }
        })
    }

    switchRank = (event) => {
        let rankingIndex = parseFloat(event.target.dataset.index)
        if(rankingIndex !== this.state.rankingIndex) {
            let currentActive = ReactDOM.findDOMNode(this).querySelector('.rankingSwitch_item.selected')
            currentActive.classList.remove('selected')
            event.target.classList.add('selected')
            this.setState({
                rankingIndex
            })
        }
    }
    
    render() {
        return(
            <section className="Ranking">
                <p className="Ranking_sectionTitle">Résultats</p>
                <div className="Ranking_table">
                    {
                        this.renderRanking(this.state.rankingIndex)
                    }
                    <div className="rankingSwitch Dashboard_athletes_selector">
                        <div className="rankingSwitch_item selected" onClick={this.switchRank} data-index={0}>Mixte</div>
                        <div className="rankingSwitch_item" onClick={this.switchRank} data-index={1}>Femmes</div>
                    </div>
                </div>
                <div className="Ranking_graphs">
                    <h4>Comparez le taux de <span className="asterisque">réussite</span> entre deux pays :</h4>
                    <span className="titleLegend">*Ratio de médaille(s) par athlète</span>
                    <div className="Ranking_graphs_container">
                        <div className="Ranking_graphs_option">
                            <input data-label={0} type="text" list="countries" defaultValue={this.props.countries[this.state.countriesIndex[0]].name} onChange={this.changeChart} />
                            <datalist id="countries">
                                {this.props.countries.map((country, key) =>
                                    <option onClick={this.changeChart} data-index={key} key={key} value={country.name} />
                                )}
                            </datalist> 
                            <div className="chart">
                                <Chart 
                                    legend={false}
                                    title={false}
                                    labels={['Médailles', 'Athlètes']}
                                    dataset={[(this.props.countries[this.state.countriesIndex[0]].medals.total / (this.props.countries[this.state.countriesIndex[0]].male + this.props.countries[this.state.countriesIndex[0]].female)).toFixed(2) * 100,
                                    (100 - (this.props.countries[this.state.countriesIndex[0]].medals.total / (this.props.countries[this.state.countriesIndex[0]].male + this.props.countries[this.state.countriesIndex[0]].female)).toFixed(2) * 100 > 0 ?
                                        100 - (this.props.countries[this.state.countriesIndex[0]].medals.total / (this.props.countries[this.state.countriesIndex[0]].male + this.props.countries[this.state.countriesIndex[0]].female)).toFixed(2) * 100
                                        : 0
                                    )]}
                                    type="ratio"
                                    shape="doughnut" 
                                    height={500}
                                    color="#e0a31f"
                                    // width={30 * this.state.data.length}
                                />
                                <p className="percentage yellow">
                                    {Math.round((this.props.countries[this.state.countriesIndex[0]].medals.total / (this.props.countries[this.state.countriesIndex[0]].male + this.props.countries[this.state.countriesIndex[0]].female)).toFixed(2) * 100)}<span>%</span>
                                </p>
                            </div>
                            <p><strong>{(this.props.countries[this.state.countriesIndex[0]].medals.total / (this.props.countries[this.state.countriesIndex[0]].male + this.props.countries[this.state.countriesIndex[0]].female)).toFixed(2)}</strong> médaille(s) par athlète<br></br>
                            ({this.props.countries[this.state.countriesIndex[0]].medals.total} médaille(s) pour {(this.props.countries[this.state.countriesIndex[0]].male + this.props.countries[this.state.countriesIndex[0]].female)} athlètes)
                            </p>
                            <div className="pib">
                                {
                                    (this.props.countries[this.state.countriesIndex[0]].gdp !== null && this.props.countries[this.state.countriesIndex[1]].gdp !== null) ? (
                                        this.props.countries[this.state.countriesIndex[0]].gdp !== null ? (
                                            <p>Compte-tenu du PIB du pays en {this.props.year}, le coût d'une médaille s'élève donc à {Math.floor((this.props.countries[this.state.countriesIndex[0]].gdp / this.props.countries[this.state.countriesIndex[0]].medals.total))}$</p>
                                        ) : (
                                            <p>Nous ne disposons pas du montant du PIB de ce pays pour l'année {this.props.year}.</p>
                                        )
                                    ) : null
                                }
                            </div>
                        </div> 
                        <div className="Ranking_graphs_option">
                            <input className="red" data-label={1} type="text" list="countries" defaultValue={this.props.countries[this.state.countriesIndex[1]].name} onChange={this.changeChart} />
                            <datalist id="countries">
                                {this.props.countries.map((country, key) =>
                                    <option onClick={this.changeChart} data-index={key} key={key} value={country.name} />
                                )}
                            </datalist> 
                            <div className="chart">
                                <Chart 
                                    legend={false}
                                    title={false}
                                    labels={['Médailles', 'Athlètes']}
                                    dataset={[(this.props.countries[this.state.countriesIndex[1]].medals.total / (this.props.countries[this.state.countriesIndex[1]].male + this.props.countries[this.state.countriesIndex[1]].female)).toFixed(2) * 100,
                                    (100 - (this.props.countries[this.state.countriesIndex[1]].medals.total / (this.props.countries[this.state.countriesIndex[1]].male + this.props.countries[this.state.countriesIndex[1]].female)).toFixed(2) * 100 > 0 ?
                                        100 - (this.props.countries[this.state.countriesIndex[1]].medals.total / (this.props.countries[this.state.countriesIndex[1]].male + this.props.countries[this.state.countriesIndex[1]].female)).toFixed(2) * 100
                                        : 0
                                    )]}
                                    type="ratio"
                                    shape="doughnut" 
                                    height={500}
                                    color="#F06543"
                                    // width={30 * this.state.data.length}
                                />
                                <p className="percentage red">
                                    {Math.round((this.props.countries[this.state.countriesIndex[1]].medals.total / (this.props.countries[this.state.countriesIndex[1]].male + this.props.countries[this.state.countriesIndex[1]].female)).toFixed(2) * 100)}<span>%</span>
                                </p>
                            </div>
                            <p><strong>{(this.props.countries[this.state.countriesIndex[1]].medals.total / (this.props.countries[this.state.countriesIndex[1]].male + this.props.countries[this.state.countriesIndex[1]].female)).toFixed(2)}</strong> médaille(s) par athlète<br></br>
                            ({this.props.countries[this.state.countriesIndex[1]].medals.total} médaille(s) pour {(this.props.countries[this.state.countriesIndex[1]].male + this.props.countries[this.state.countriesIndex[1]].female)} athlètes)
                            </p>
                            <div className="pib">
                                {
                                    (this.props.countries[this.state.countriesIndex[0]].gdp !== null && this.props.countries[this.state.countriesIndex[1]].gdp !== null) ? (
                                        this.props.countries[this.state.countriesIndex[1]].gdp !== null ? (
                                            <p>Compte-tenu du PIB du pays en {this.props.year}, le coût d'une médaille s'élève donc à {Math.floor(this.props.countries[this.state.countriesIndex[1]].gdp / this.props.countries[this.state.countriesIndex[1]].medals.total)}$</p>
                                        ) : (
                                            <p>Nous ne disposons pas du montant du PIB de ce pays pour l'année {this.props.year}.</p>
                                        )
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Ranking