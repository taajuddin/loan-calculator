import React from "react";
import axios from "axios";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";


import "./Home.css";

class Home extends React.Component{
	state = {
		interestRate: 0,
		monthlyPayment: 0,
		
	};

	componentDidMount() {
		const loanAmount=localStorage.getItem('loanAmount',this.state.amount)
		const loanMonth=localStorage.getItem('loanMonth',this.state.months)
		console.log(loanMonth,loanAmount)
		if(loanAmount){
			this.props.setAmount(loanMonth);
		}
		if(loanMonth){
			this.props.setMonths(loanMonth);
		}
					
		axios.get(
				`https://ftl-frontend-test.herokuapp.com/interest?amount=${
					this.props.amount
				}&numMonths=${this.props.months}`
			)
			.then(res => {
				this.setState({
					interestRate: res.data.interestRate,
					monthlyPayment: res.data.monthlyPayment.amount,
					
				});
			})
	}

	// componentDidUpdate(prevState) {
	// 	if (
	// 		this.state.amount === prevState.amount &&
	// 		this.state.months === prevState.months
	// 	) {
	// 		return false;
	// 	}
	// }
	onLoanAmountChange=()=>{
		axios
				.get(
					`https://ftl-frontend-test.herokuapp.com/interest?amount=${
						this.props.amount
					}&numMonths=${this.props.months}`
				)
				.then(res => {
					console.log(res.data);
					 if(res.data) {
						this.setState({
							interestRate: res.data.interestRate,
							monthlyPayment: res.data.monthlyPayment.amount,
							
						});
						//const loanHistory=localStorage.setItem('loanHistory','')
						const loanAmount=localStorage.setItem('loanAmount',this.props.amount)
						const loanMonth=localStorage.setItem('loanMonth',this.props.months)

						const history = localStorage.getItem('history');
						if(history) {
							const temp = JSON.parse(history);
							localStorage.setItem('history',JSON.stringify([{amount :this.props.amount, months: this.props.months},...temp]));

						} else {
							localStorage.setItem('history',JSON.stringify([{amount :this.props.amount, months: this.props.months}]));
						}
					}
				})
	}


	render() {
		return (
			<div className='container'>
					<form>
						<div className="form-group">
							<label>Loan Amount</label>
							<InputRange
								maxValue={5000}
								minValue={500}
								value={this.props.amount}
								onChange={amount => this.props.setAmount( amount )}
								onChangeComplete={this.onLoanAmountChange}
								style={{background: 'red', borderColor: 'red'}}
								
							/>
						</div>
						<div className="form-group">
							<label>Loan Duration (in months)</label>
							<InputRange
								maxValue={24}
								minValue={6}
								value={this.props.months}
								onChange={months => this.props.setMonths(months )}
								onChangeComplete={this.onLoanAmountChange}
							/>
						</div>
					</form>
					<br />
					<div className="interest">
						<h2>Interest Details: </h2>
						<p className="interest-data">
							<span className="interest-label">Interest Rate: </span>
							<span className="interest-display">
								${this.state.interestRate}
							</span>
						</p>
						<p className="interest-data">
							<span className="interest-label">Monthly Payment:</span>{" "}
							<span className="payment-display">
								${this.state.monthlyPayment}
							</span>
						</p>
					</div>
			</div>
		);
	}
}

export default Home;
