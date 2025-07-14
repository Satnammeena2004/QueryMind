import { Github, Linkedin, Twitter, X } from "lucide-react";

export const exampleResults = [
  {
    data: [
      {
        year: "2007",
        sf_unicorns: "0",
        ny_unicorns: "0",
      },
      {
        year: "2011",
        sf_unicorns: "0",
        ny_unicorns: "0",
      },
      {
        year: "2012",
        sf_unicorns: "0",
        ny_unicorns: "0",
      },
      {
        year: "2013",
        sf_unicorns: "2",
        ny_unicorns: "0",
      },
      {
        year: "2014",
        sf_unicorns: "1",
        ny_unicorns: "0",
      },
      {
        year: "2015",
        sf_unicorns: "3",
        ny_unicorns: "1",
      },
      {
        year: "2016",
        sf_unicorns: "0",
        ny_unicorns: "0",
      },
      {
        year: "2017",
        sf_unicorns: "3",
        ny_unicorns: "2",
      },
      {
        year: "2018",
        sf_unicorns: "10",
        ny_unicorns: "3",
      },
      {
        year: "2019",
        sf_unicorns: "14",
        ny_unicorns: "6",
      },
      {
        year: "2020",
        sf_unicorns: "12",
        ny_unicorns: "11",
      },
      {
        year: "2021",
        sf_unicorns: "85",
        ny_unicorns: "56",
      },
      {
        year: "2022",
        sf_unicorns: "33",
        ny_unicorns: "31",
      },
      {
        year: "2023",
        sf_unicorns: "6",
        ny_unicorns: "3",
      },
      {
        year: "2024",
        sf_unicorns: "17",
        ny_unicorns: "9",
      },
    ],
    config: {
      description:
        "This line chart visualizes the number of unicorns in San Francisco (SF) and New York (NY) over time, from 2007 to 2024.  It effectively compares the growth trends of unicorns in these two tech hubs.",
      takeaway:
        "San Francisco shows a significantly higher number of unicorns compared to New York throughout most of the period, although both cities experienced growth spurts, particularly around 2021.  Both cities experienced a decline in 2022 and 2023.",
      type: "line",
      title: "Unicorn Count in SF vs NY (2007-2024)",
      xKey: "year",
      yKeys: ["sf_unicorns", "ny_unicorns"],
      multipleLines: true,
      lineCategories: ["sf_unicorns", "ny_unicorns"],
      legend: true,
    },
    columns: ["year", "sf_unicorns", "ny_unicorns"],
  },
];

export const UNICORNS_WITH_ICONS = [
  { name: "SpaceX", icons: "https://cdn.simpleicons.org/spacex/spacex" },
  {
    name: "ByteDance",
    icons: "https://cdn.simpleicons.org/bytedance/bytedance",
  },
  { name: "OpenAI", icons: "https://cdn.simpleicons.org/openai/openai" },
  { name: "Stripe", icons: "https://cdn.simpleicons.org/stripe/stripe" },
  { name: "SHEIN", icons: "https://cdn.simpleicons.org/shein/shein" },
  {
    name: "Databricks",
    icons: "https://cdn.simpleicons.org/databricks/databricks",
  },
  { name: "xAI", icons: "https://cdn.simpleicons.org/xai/xai" },
  { name: "Revolut", icons: "https://cdn.simpleicons.org/revolut/revolut" },
  { name: "Canva", icons: "https://cdn.simpleicons.org/canva/canva" },
  { name: "Fanatics", icons: "https://cdn.simpleicons.org/fanatics/fanatics" },
  { name: "Chime", icons: "https://cdn.simpleicons.org/chime/chime" },
  {
    name: "CoreWeave",
    icons: "https://cdn.simpleicons.org/coreweave/coreweave",
  },
  {
    name: "Epic Games",
    icons: "https://cdn.simpleicons.org/epic-games/epic-games",
  },
  { name: "Miro", icons: "https://cdn.simpleicons.org/miro/miro" },
  {
    name: "Xiaohongshu",
    icons: "https://cdn.simpleicons.org/xiaohongshu/xiaohongshu",
  },
  {
    name: "Anthropic",
    icons: "https://cdn.simpleicons.org/anthropic/anthropic",
  },
  {
    name: "Yuanfudao",
    icons: "https://cdn.simpleicons.org/yuanfudao/yuanfudao",
  },
  {
    name: "DJI Innovations",
    icons: "https://cdn.simpleicons.org/dji-innovations/dji-innovations",
  },
  { name: "Discord", icons: "https://cdn.simpleicons.org/discord/discord" },
  { name: "Gopuff", icons: "https://cdn.simpleicons.org/gopuff/gopuff" },
];

export const suggestionQueries = [
  {
    desktop: "Compare count of unicorns in SF and NY over time",
    mobile: "SF vs NY",
  },
  {
    desktop: "Compare unicorn valuations in the US vs China over time",
    mobile: "US vs China",
  },
  {
    desktop: "Countries with highest unicorn density",
    mobile: "Top countries",
  },
  {
    desktop:
      "Show the number of unicorns founded each year over the past two decades",
    mobile: "Yearly count",
  },
  {
    desktop: "Display the cumulative total valuation of unicorns over time",
    mobile: "Total value",
  },
  {
    desktop:
      "Compare the yearly funding amounts for fintech vs healthtech unicorns",
    mobile: "Fintech vs health",
  },
  {
    desktop: "Which cities have with most SaaS unicorns",
    mobile: "SaaS cities",
  },
  {
    desktop: "Show the countries with highest unicorn density",
    mobile: "Dense nations",
  },
  {
    desktop:
      "Show the number of unicorns (grouped by year) over the past decade",
    mobile: "Decade trend",
  },
  {
    desktop:
      "Compare the average valuation of AI companies vs. biotech companies",
    mobile: "AI vs biotech",
  },
  {
    desktop: "Investors with the most unicorns",
    mobile: "Top investors",
  },
];


export const authorsSocialLinks = [{

  name: "x",
  icon: Twitter,
  url: "https://x.com/Satnam_72"
}, {

  name: "linkedin",
  icon: Linkedin,
  url: "https://www.linkedin.com/in/satnam-meena-747a12267"
}, {

  name: "github",
  icon: Github,
  url: "https://github.com/Satnammeena2004"
}]

export const pricingPlans = [
  {
    "title": "Free",
    "price": "$0",
    "description": "Perfect for exploring the basic features.",
    "features": [
      "Upload JSON and CSV files",
      "Natural language queries",
      "Generate charts",
      "Limit of 3 tables",
      "Max file size: 10KB",
      "Community support",
      "No account linking",
      "Limited chart types"
    ]
  },

  {
    "title": "Professional",
    "price": "$29",
    "description": "Built for small teams and collaborators.",
    "features": [
      "Everything in Pro, plus:",
      "Team workspaces",
      "Role-based access control",
      "Shared dashboards",
      "Up to 10 GB storage",
      "Priority email support",
      "Scheduled reports & chart delivery"
    ]
  },
  {
    "title": "Enterprise",
    "price": "Custom Pricing",
    "description": "Tailored solutions for large organizations with advanced needs.",
    "features": [
      "Everything in Team, plus:",
      "Unlimited storage",
      "Custom SLAs",
      "Dedicated account manager",
      "SSO & advanced security",
      "Custom integrations",
      "24/7 phone & chat support"
    ]
  }
]



export const ExampleInitialQuery = {
  activeQuery:
    "SELECT EXTRACT(YEAR FROM date_joined) AS year, COUNT(CASE WHEN city = 'San Francisco' THEN id END) AS sf_unicorns, COUNT(CASE WHEN city = 'New York' THEN id END) AS ny_unicorns FROM unicorns GROUP BY year ORDER BY year",
  inputValue: "Compare count of unicorns in SF and NY over time",
};

export const ExampleAnalyseAdvancedDataSystemPropmt = `"You are a data engineering assistant. Your task is to analyze the provided file or raw data and generate a suitable SQL schema for storing the data in a SQL database. Follow these steps:

Examine the structure, data types, and content of the provided file or raw data.

Handle Inconsistencies: If the data contains inconsistencies (e.g., mixed data types, incorrect formats, or missing values), convert it into a suitable format for SQL. For example:

Handle missing or nullish values by using NULL or default values where applicable.


Generate Schema: Create a SQL schema that matches the analyzed data. Ensure the schema is optimized for SQL databases, with appropriate data types, primary keys, and constraints.
And Returned Result must be the sql schema and appropriate sql insertion query for the provided dataset the retruned result is object and and schema is {schema:string,insertionQuery:string} 

`;


