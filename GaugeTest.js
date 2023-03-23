(function() { 



	let template = document.createElement("template");
	template.innerHTML = `
			<style>
				:host {
					display: block;
				} 
			</style> 
			<div id="chart_div"></div>
		`;

	class GoogleGauge extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};
		}

		connectedCallback(){
			
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };

		}

		onCustomWidgetAfterUpdate(changedProperties) {
			console.log("onCustomWidgetAfterUpdate")
			console.log("this._props prop = ", this._props);
			this._props = { ...this._props, ...changedProperties };

			var ctx = this.shadowRoot.getElementById('chart_div');

			var myProps = this._props
			
			google.charts.load('current', {'packages':['gauge']});
			google.charts.setOnLoadCallback(function() {
				drawChart(myProps);
			});
			console.log("changedProperties = ", changedProperties);

			function drawChart(props) {
				console.log("props =", props)
				var data = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				[props.label, props.value]
				]);

				var options = {
				chartArea: {
					// leave room for y-axis labels
					width: '94%'
					},
					legend: {
					position: 'top'
					},
					width: '100%',
				redFrom: props.redFrom, redTo: props.redTo,
				yellowFrom:props.yellowFrom, yellowTo: props.yellowTo,
				minorTicks: 5
				};

				var chart = new google.visualization.Gauge(ctx);

				chart.draw(data, options);
			}
		}
	}

	customElements.define("com-sap-sample-google", GoogleGauge);
})();