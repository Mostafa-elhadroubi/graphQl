import { jwt } from "./main.js"
import { signin } from "./signin.js";
export const profile = async() => {    
    const profileCSS = document.createElement('link');
    profileCSS.rel = 'stylesheet';
    profileCSS.href = 'profile.css';
    document.head.appendChild(profileCSS);

    const query = {
        query:`{
  user {
    auditRatio
    firstName
    lastName
    transactions1: transactions(where: { type: { _like: "skill_%" } }, distinct_on: type, order_by:[{type:asc}, {amount: desc}]) {
      type
      amount
    }
    transactions2: transactions(
      where: { 
        _and: [{ type: { _eq: "level" } }, { object: { type: { _eq: "project" } } }] 
      }
      limit: 1
      order_by: { amount: desc }
    ) {
      amount
    }
    totalDown
    totalUp
  }
}

            `}
        let res = await fetchData(query)
        console.log(res)
        header(res)
        SkillsGraph(res)
        drawCirle(res)
}

const fetchData = async(query) => {
    try {
        const jwt = localStorage.getItem('jwt');
        console.log(jwt);
        
        const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)

        })
        console.log( response)
        const res = await response.json()
        console.log(res);
        if (!res || res.errors) {
            signin()
            return
        }
        return res
        
    }catch(error) {
        console.log("error: ", error)
    }
}


const SkillsGraph = (res) => {
    console.log(res);
    let skills = res.data.user[0].transactions1;

    const skillPercentages = skills.map(item => ({ 
        ...item, 
        type: item.type.replace("skill_", "") 
    }));
    
    // Graph dimensions
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 40, right: 20, bottom: 80, left: 50 };
    const graphWidth = svgWidth - margin.left - margin.right;
    const graphHeight = svgHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("id", "svgGraph1");
    document.querySelector('.svg').appendChild(svg);

    // Dynamic bar spacing calculations
    const minBarWidth = 30;
    const minBarSpacing = 10;
    const totalBars = skillPercentages.length;
    
    const maxSpace = graphWidth - (totalBars * minBarSpacing);
    const barWidth = Math.min(minBarWidth, maxSpace / totalBars);
    const barSpacing = (graphWidth - (totalBars * barWidth)) / (totalBars + 1);
    
    // Create bars
    skillPercentages.forEach((skill, index) => {
        const x = margin.left + (index * (barWidth + barSpacing)) + barSpacing;
        const barHeight = (skill.amount / 100) * graphHeight;
        const y = margin.top + (graphHeight - barHeight);

        // Bar
        const rectSkills = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rectSkills.setAttribute("x", x);
        rectSkills.setAttribute("y", y);
        rectSkills.setAttribute("width", barWidth);
        rectSkills.setAttribute("height", barHeight);
        rectSkills.setAttribute("fill", "whitesmoke");
        svg.appendChild(rectSkills);

        // Skill label 
        const textSkills = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textSkills.setAttribute("x", x + barWidth / 2);
        textSkills.setAttribute("y", svgHeight - margin.bottom / 2);
        textSkills.setAttribute("text-anchor", "middle");
        textSkills.setAttribute("fill", "#FF4500");
        textSkills.setAttribute("font-size", "16");
        textSkills.setAttribute("transform", `rotate(45 ${x + barWidth / 2} ${svgHeight - margin.bottom / 2})`);
        textSkills.textContent = skill.type;
        svg.appendChild(textSkills);

        // Percentage label (above bar)
        const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        percentText.setAttribute("x", x + barWidth / 2);
        percentText.setAttribute("y", y - 5);
        percentText.setAttribute("text-anchor", "middle");
        percentText.setAttribute("fill", "#20B2AA");
        percentText.setAttribute("font-size", "16");
        percentText.textContent = `${Math.round(skill.amount)}%`;
        svg.appendChild(percentText);
    });

    // Axes
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", margin.left);
    xAxis.setAttribute("y1", margin.top + graphHeight);
    xAxis.setAttribute("x2", margin.left + graphWidth);
    xAxis.setAttribute("y2", margin.top + graphHeight);
    xAxis.setAttribute("stroke", "black");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", margin.left);
    yAxis.setAttribute("y1", margin.top);
    yAxis.setAttribute("x2", margin.left);
    yAxis.setAttribute("y2", margin.top + graphHeight);
    yAxis.setAttribute("stroke", "black");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);

    // Y-axis labels (0% to 100%)
    for (let i = 0; i <= 100; i += 10) {
        const y = margin.top + graphHeight - (i / 100) * graphHeight;
        
        // Grid line
        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", margin.left);
        gridLine.setAttribute("y1", y);
        gridLine.setAttribute("x2", margin.left + graphWidth);
        gridLine.setAttribute("y2", y);
        gridLine.setAttribute("stroke", "#94a3b8");
        gridLine.setAttribute("stroke-width", "0.5");
        svg.appendChild(gridLine);
        
        // Percentage label
        const percentage = document.createElementNS("http://www.w3.org/2000/svg", "text");
        percentage.setAttribute("x", margin.left -5);
        percentage.setAttribute("y", y + 5);
        percentage.setAttribute("text-anchor", "end");
        percentage.setAttribute("fill", "#22c55e");
        percentage.setAttribute("font-size", "16");
        percentage.textContent = `${i}%`;
        svg.appendChild(percentage);
    }
};


const drawCirle = (res) => {
    const value = res.data.user[0].transactions2[0].amount
const total = 60;
const radius = 80; 
const circumference = 2 * Math.PI * radius;
const offset = circumference * (1 - value / total); 

// Create the SVG element
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "200");
svg.setAttribute("height", "200");
document.querySelector('.audit').appendChild(svg);

// Background Circle
const backgroundCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
backgroundCircle.setAttribute("cx", "100");
backgroundCircle.setAttribute("cy", "100");
backgroundCircle.setAttribute("r", radius.toString());
backgroundCircle.setAttribute("fill", "#500073");
backgroundCircle.setAttribute("stroke", "whitesmoke");
backgroundCircle.setAttribute("stroke-width", "10");
svg.appendChild(backgroundCircle);

// Foreground Arc
const foregroundArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
foregroundArc.setAttribute("d", `M 100 20 A ${radius} ${radius} 0 1 1 100 180`);
foregroundArc.setAttribute("fill", "none");
foregroundArc.setAttribute("stroke", "#007bff");
foregroundArc.setAttribute("stroke-width", "10");
foregroundArc.setAttribute("stroke-dasharray", circumference.toString());
foregroundArc.setAttribute("stroke-dashoffset", offset.toString());
svg.appendChild(foregroundArc);

// Text Inside the Circle
const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
text.setAttribute("x", "100");
text.setAttribute("y", "100");
text.setAttribute("text-anchor", "middle");
text.setAttribute("dominant-baseline", "middle");
text.setAttribute("fill", "#3B82F6");
text.setAttribute("font-size", "30");
text.textContent = `Level: ${value}`; // Display the percentage
svg.appendChild(text);


}
const header = (data) => {
    console.log(data)
    const res = data.data.user[0]
    let down = res.totalDown / 1000000
    let up = res.totalUp / 1000000
    const container = document.createElement('div')
    container.classList.add("container")
    container.innerHTML = `
    <div class="logout"><button>logout</button></div>
    
    <div class="header">
    <h1>Welcome, <span class="name">${data.data.user[0].firstName} ${data.data.user[0].lastName}</span></h1>
    </div>
        <div class="audit">
            <div class="audits"><h3>Audit Ration: ${res.auditRatio.toFixed(2)}</h3></div>
            
            <div class="audits"><h3>Total Down:<span>${down.toFixed(2)}MB</span></h3></div>
            
            <div class="audits"><h3>Total Up: <span>${up.toFixed(2)}MB</span></h3></div>
            
        </div>
        <div class="svg"></div>
    `
    document.body.appendChild(container)
    logout()
}
const logout = () => {
    const logout = document.querySelector('.logout')
    logout.addEventListener('click', () => {
        console.log(jwt);
        if (jwt) {
            localStorage.removeItem('jwt')

            signin()
        }
        
    })
}
