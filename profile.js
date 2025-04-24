import { jwt } from "./main.js"
import { signin } from "./signin.js";
export const profile = async() => {
    console.log(jwt);
    
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
    transactions1: transactions(where: { type: { _like: "skill_%" } }, distinct_on: type) {
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
            console.error("GraphQL Error:", res.errors);
            throw new Error("GraphQL error or empty response.");
        }
        return res
        
    }catch(error) {
        alert("error")
    }
}


const SkillsGraph = (res) => {
    console.log(res);
    let skills = res.data.user[0].transactions1;

    // Process data (unchanged)
    skills = skills.map(item => ({ ...item, type: item.type.replace("skill_", "") }));
    const skillObj = skills.reduce((acc, { type, amount }) => {
        acc[type] = (acc[type] || 0) + amount;
        return acc;
    }, {});
    const totalSum = Object.values(skillObj).reduce((sum, value) => sum + value, 0);
    const skillPercentages = Object.keys(skillObj).map(key => ({
        type: key,
        amount: (skillObj[key] / totalSum) * 100
    }));

    // Graph dimensions (adjusted for consistency)
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 20, right: 20, bottom: 80, left: 50 };
    const graphWidth = svgWidth - margin.left - margin.right;
    const graphHeight = svgHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("id", "svgGraph1");
    document.querySelector('.container').appendChild(svg);

    const barWidth = 30;
    const barSpacing = 40;
    const maxBarHeight = graphHeight * 0.8; // 80% of graph height

    skillPercentages.forEach((skill, index) => {
        const x = margin.left + index * barSpacing;
        const barHeight = (skill.amount / 100) * maxBarHeight;
        const y = margin.top + (graphHeight - barHeight);

        const rectSkills = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rectSkills.setAttribute("x", x);
        rectSkills.setAttribute("y", y);
        rectSkills.setAttribute("width", barWidth);
        rectSkills.setAttribute("height", barHeight);
        rectSkills.setAttribute("fill", "#3B82F6");
        svg.appendChild(rectSkills);

        // Skill label (below bar)
        const textSkills = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textSkills.setAttribute("x", x + (barWidth / 2) -30);
        textSkills.setAttribute("y", svgHeight - margin.bottom / 2 -10);  // Adjusted y-position
        textSkills.setAttribute("text-anchor", "start");  // Changed to 'start' for better alignment when rotated
        textSkills.setAttribute("fill", "#313130");
        textSkills.setAttribute("font-size", "18");
        textSkills.setAttribute("transform", `rotate(45 ${x + barWidth / 2} ${svgHeight - margin.bottom / 2 + 15})`);
        textSkills.textContent = skill.type;
        svg.appendChild(textSkills);
        // Percentage label (above bar)
        const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        percentText.setAttribute("x", x + barWidth / 2);
        percentText.setAttribute("y", y - 5);
        percentText.setAttribute("text-anchor", "middle");
        percentText.setAttribute("fill", "#313130");
        percentText.setAttribute("font-size", "18");
        percentText.textContent = `${Math.floor(skill.amount)}%`;
        svg.appendChild(percentText);
    });

    // Axes (white for visibility)
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", margin.left);
    xAxis.setAttribute("y1", margin.top + graphHeight);
    xAxis.setAttribute("x2", margin.left + graphWidth);
    xAxis.setAttribute("y2", margin.top + graphHeight);
    xAxis.setAttribute("stroke", "#313130");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", margin.left);
    yAxis.setAttribute("y1", margin.top);
    yAxis.setAttribute("x2", margin.left);
    yAxis.setAttribute("y2", margin.top + graphHeight);
    yAxis.setAttribute("stroke", "#313130");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);

    // Y-axis labels (0% to 100%)
    for (let i = 0; i <= 100; i += 20) {
        const y = margin.top + graphHeight - (i / 100) * graphHeight;
        const percentage = document.createElementNS("http://www.w3.org/2000/svg", "text");
        percentage.setAttribute("x", margin.left - 10);
        percentage.setAttribute("y", y + 4);
        percentage.setAttribute("text-anchor", "end");
        percentage.setAttribute("fill", "#313130");
        percentage.setAttribute("font-size", "18");
        percentage.textContent = `${i}%`;
        svg.appendChild(percentage);
    }
};
// Replace the skillsGraph call in your profile function with:
// SkillsGraph(res);





const drawCirle = (res) => {
    const v = res.data.user[0].transactions2[0].amount
    console.log(v)
    const value = v; // Progress value (e.g., 45%)
const total = 60; // Total value (e.g., 100)
const radius = 80; // Radius of the circle
const circumference = 2 * Math.PI * radius; // Circumference of the circle
const offset = circumference * (1 - value / total); // Dash offset for the arc

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
backgroundCircle.setAttribute("fill", "none");
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
text.setAttribute("fill", "white");
text.setAttribute("font-size", "30");
text.textContent = `${value}%`; // Display the percentage
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
        <div class="header">
            <h1>Welcome, ${data.data.user[0].firstName} ${data.data.user[0].lastName}</h1>
            <button class="logout">logout</button>
        </div>
        <div class="audit">
            <h3>Audit Ration: ${res.auditRatio.toFixed(2)}</h3>
            <h3>Total Down: ${down.toFixed(2)}MB</h3>
            <h3>Total Up: ${up.toFixed(2)}MB</h3>
        </div>
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
