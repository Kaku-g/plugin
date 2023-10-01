var observableAttributes = [
  // The value of the cell that the plugin is being rendered in
  "cellvalue",
  // The value of the row that the plugin is being rendered in
  "rowvalue",
  // The value of the table that the plugin is being rendered in
  "tablevalue",
  // The schema of the table that the plugin is being rendered in
  "tableschemavalue",
  // The schema of the database that the plugin is being rendered in
  "databaseschemavalue",
  // The configuration object that the user specified when installing the plugin
  "configuration",
  // Additional information about the view such as count, page and offset.
  "metadata",
];

var OuterbaseEvent = {
  // The user has triggered an action to save updates
  onSave: "onSave",
};

var OuterbaseColumnEvent = {
  // The user has began editing the selected cell
  onEdit: "onEdit",
  // Stops editing a cells editor popup view and accept the changes
  onStopEdit: "onStopEdit",
  // Stops editing a cells editor popup view and prevent persisting the changes
  onCancelEdit: "onCancelEdit",
  // Updates the cells value with the provided value
  updateCell: "updateCell",
};

var OuterbaseTableEvent = {
  // Updates the value of a row with the provided JSON value
  updateRow: "updateRow",
  // Deletes an entire row with the provided JSON value
  deleteRow: "deleteRow",
  // Creates a new row with the provided JSON value
  createRow: "createRow",
  // Performs an action to get the next page of results, if they exist
  getNextPage: "getNextPage",
  // Performs an action to get the previous page of results, if they exist
  getPreviousPage: "getPreviousPage",
};

/**
 * ******************
 * Custom Definitions
 * ******************
 *
 *  ░░░░░░░░░░░░░░░░░
 *  ░░░░▄▄████▄▄░░░░░
 *  ░░░██████████░░░░
 *  ░░░██▄▄██▄▄██░░░░
 *  ░░░░▄▀▄▀▀▄▀▄░░░░░
 *  ░░░▀░░░░░░░░▀░░░░
 *  ░░░░░░░░░░░░░░░░░
 *
 * Define your custom classes here. We do recommend the usage of our `OuterbasePluginConfig_$PLUGIN_ID`
 * class for you to manage properties between the other classes below, however, it's strictly optional.
 * However, this would be a good class to contain the properties you need to store when a user installs
 * or configures your plugin.
 */
class OuterbasePluginConfig_$PLUGIN_ID {
  // Inputs from Outerbase for us to retain
  tableValue = undefined;
  count = 0;
  page = 1;
  offset = 50;
  theme = "light";

  // Inputs from the configuration screen

  firstValue = undefined;
  secondValue = undefined;
  thirdValue = undefined;

  //

  // Variables for us to hold state of user actions
  deletedRows = [];

  constructor(object) {
    this.firstValue = object?.firstValue;
    this.secondValue = object?.secondValue;
    this.thirdValue = object?.thirdValue;
    //
    //this.data = object?.data;
  }

  toJSON() {
    return {
      firstValue: this.firstValue,
      secondValue: this.secondValue,
      thirdValue: this.thirdValue,
      data: this.data,
    };
  }
}

var triggerEvent = (fromClass, data) => {
  const event = new CustomEvent("custom-change", {
    detail: data,
    bubbles: true,
    composed: true,
  });

  fromClass.dispatchEvent(event);
};

var decodeAttributeByName = (fromClass, name) => {
  if (fromClass.getAttribute(name)) {
    const encodedJSON = fromClass.getAttribute(name);
    if (encodedJSON && encodedJSON !== "undefined") {
      const decodedJSON = encodedJSON
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'");
      return decodedJSON ? JSON.parse(decodedJSON) : {};
    }
  }
};

/**
 * **********
 * Table View
 * **********
 *
 *  ░░░░░░░░░░░░░░░░░░
 *
 *  ░░░░░▄▄████▄▄░░░░░
 *  ░░░▄██████████▄░░░
 *  ░▄██▄██▄██▄██▄██▄░
 *  ░░░▀█▀░░▀▀░░▀█▀░░░
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░░░░░░░░░░░░░░
 */
var templateTable = document.createElement("template");
templateTable.innerHTML = `
        <style>
        .container {
          width: 70%;
          min-width: 50%;
          margin: auto;
          display: flex;
          flex-direction: column;
          overflow:scroll
          overflow-y:scroll
        }
        #theme-container{
          overflow:scroll
        }
        
        
      
        #kanban-config>div{
          display:flex;
          width:80%;
          flex-wrap:wrap;
          
        }
        
      
        .task {
          background-color: white;
          margin: 0.2rem 0rem 0.3rem 0rem;
          border: 0.1rem solid black;
          border-radius: 0.2rem;
          padding: 0.5rem 0.2rem 0.5rem 2rem;
          
        }
        
        #task-button {
          margin: 0.2rem 0rem 0.1rem 0rem;
          background-color: white;
          border-radius: 0.2rem;
          width: 100%;
          border: 0.25rem solid black;
          padding: 0.5rem 2.7rem;
          border-radius: 0.3rem;
          font-size: 1rem;
        }
        
        /*   */
    
    
    
        /* ---- RESET/BASIC STYLING ---- */
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: sans-serif;
    
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }
    
    
    
    .board {
      width: 100%;
      height: 100vh;
      overflow: scroll;
    
      background-image: url(https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80);
      background-position: center;
      background-size: cover;
    }
    
    
    /* ---- BOARD ---- */
    .kanban {
      display: flex;
      align-items: flex-start;
      justify-content: start;
      gap: 16px;
    
      padding: 24px 32px;
    
      overflow: scroll;
      height: 500px;
    }
    
    .heading {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .board {
      display: flex;
      flex-direction: column;
      gap: 12px;
    
      background: #f4f4f4;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.25);
    
      padding: 12px;
      border-radius: 4px;
      width: 225px;
      min-height: 120px;
      height:100%
      flex-wrap:wrap;
    
      flex-shrink: 0;
    }
    
    .task {
      background: white;
      color: black;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
    
      padding: 12px;
      border-radius: 4px;
      word-wrap: break-word;
    
      font-size: 16px;
      cursor: move;
    
    }
    
    .is-dragging {
      scale: 1.05;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.25);
      background: rgb(50, 50, 50);
      color: white;
    }
        </style>
        
        <div id="theme-container">

        <div id="container">
        
        </div>
        </div>
      
       
        `;
// Can the above div just be a self closing container: <div />

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return observableAttributes;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateTable.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );

    this.config.tableValue = decodeAttributeByName(this, "tableValue");

    //console.log(this.config.tableValue);

    // console.log(this.config.data);
    this.config.theme = decodeAttributeByName(this, "metadata").theme;

    var element = this.shadow.getElementById("theme-container");
    element.classList.remove("dark");
    element.classList.add(this.config.theme);

    this.render();
  }

  render() {
    this.shadow.querySelector("#container").innerHTML = `

    <div class="kanban">
    <div class="board" id="todo-lane">
    <h3 class="heading" contentEditable="true">Todo</h3>
    
    ${
      this.config?.tableValue?.length &&
      this.config?.tableValue
        ?.map(
          (row) =>
            `<div class="task"   draggable="true">
        <div><span style="font-size:15px;font-weight:bold;">${
          this.config.firstValue
        }:</span>${row[this.config.firstValue]}</div>
            <div><span style="font-size:15px;font-weight:bold;">${
              this.config.secondValue
            }:</span>${row[this.config.secondValue]}</div>
            <div><span style="font-size:15px;font-weight:bold;">${
              this.config.thirdValue
            }:</span>${row[this.config.thirdValue]}</div>
         </div>`
        )
        .join(" ")
    }



      </div>
      <div class="board">
      <h3 class="heading" contentEditable="true">Doing</h3>

      
    </div>

    <div class="board">
    <h3 class="heading" contentEditable="true">Done</h3>

   
  </div>

  </div>
    `;

    const draggables = this.shadow.querySelectorAll(".task");
    const droppables = this.shadow.querySelectorAll(".board");

    draggables.forEach((task) => {
      task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
      });

      task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
      });
    });

    droppables.forEach((zone) => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(zone, e.clientY);
        const curTask = this.shadow.querySelector(".is-dragging");

        if (!bottomTask) {
          zone.appendChild(curTask);
        } else {
          zone.insertBefore(curTask, bottomTask);
        }
      });
    });

    const insertAboveTask = (zone, mouseY) => {
      const els = zone.querySelectorAll(".task:not(.is-dragging)");

      let closestTask = null;
      let closestOffset = Number.NEGATIVE_INFINITY;

      els.forEach((task) => {
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          closestTask = task;
        }
      });

      return closestTask;
    };

    const deleteRowButtons = this.shadow.querySelectorAll(".deleteRowButton");
    deleteRowButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        let row = this.config.tableValue[index];
        triggerEvent(this, {
          action: OuterbaseTableEvent.deleteRow,
          value: row,
        });

        this.config.deletedRows.push(row);
        this.config.tableValue.splice(index, 1);
        this.render();
      });
    });

    var previousPageButton = this.shadow.getElementById("previousPageButton");
    previousPageButton.addEventListener("click", () => {
      triggerEvent(this, {
        action: OuterbaseTableEvent.getPreviousPage,
        value: {},
      });
    });

    var nextPageButton = this.shadow.getElementById("nextPageButton");
    nextPageButton.addEventListener("click", () => {
      triggerEvent(this, {
        action: OuterbaseTableEvent.getNextPage,
        value: {},
      });
    });
  }
}

/**
 * ******************
 * Configuration View
 * ******************
 *
 *  ░░░░░░░░░░░░░░░░░
 *  ░░░░░▀▄░░░▄▀░░░░░
 *  ░░░░▄█▀███▀█▄░░░░
 *  ░░░█▀███████▀█░░░
 *  ░░░█░█▀▀▀▀▀█░█░░░
 *  ░░░░░░▀▀░▀▀░░░░░░
 *  ░░░░░░░░░░░░░░░░░
 *
 * When a user either installs a plugin onto a table resource for the first time
 * or they configure an existing installation, this is the view that is presented
 * to the user. For many plugin applications it's essential to capture information
 * that is required to allow your plugin to work correctly and this is the best
 * place to do it.
 *
 * It is a requirement that a save button that triggers the `OuterbaseEvent.onSave`
 * event exists so Outerbase can complete the installation or preference update
 * action.
 */

var templateConfiguration = document.createElement("template");
templateConfiguration.innerHTML = `
        <style>
            #configuration-container {
                display: flex;
                height: 100%;
                overflow-y: scroll;
                padding: 40px 50px 65px 40px;
            }
    
            .field-title {
                font: "Inter", sans-serif;
                font-size: 12px;
                line-height: 18px;
                font-weight: 500;
                margin: 0 0 8px 0;
            }
    
            select {
                width: 320px;
                height: 40px;
                margin-bottom: 16px;
                background: transparent;
                border: 1px solid #343438;
                border-radius: 8px;
                color: black;
                font-size: 14px;
                padding: 0 8px;
                cursor: pointer;
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="black" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
                background-position: 100%;
                background-repeat: no-repeat;
                appearance: none;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
            }
    
            input {
                width: 320px;
                height: 40px;
                margin-bottom: 16px;
                background: transparent;
                border: 1px solid #343438;
                border-radius: 8px;
                color: black;
                font-size: 14px;
                padding: 0 8px;
            }
    
            button {
                border: none;
                background-color: #834FF8;
                color: white;
                padding: 6px 18px;
                font: "Inter", sans-serif;
                font-size: 14px;
                line-height: 18px;
                border-radius: 8px;
                cursor: pointer;
            }
    
            .preview-card {
                margin-left: 80px;
                width: 240px;
                background-color: white;
                border-radius: 16px;
                overflow: hidden;
            }
    
            .preview-card > img {
                width: 100%;
                height: 165px;
            }
    
            .preview-card > div {
                padding: 16px;
                display: flex;
                flex-direction: column;
                color: black;
            }
    
            .preview-card > div > p {
                margin: 0;
            }
    
            .dark {
                #configuration-container {
                    background-color: black;
                    color: white;
                }
            }
    
            .dark > div > div> input {
                color: white !important;
            }
    
            .dark > div > div> select {
                color: white !important;
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="white" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
            }
        </style>
    
        <div id="theme-container">
            <div id="configuration-container">
    
            </div>
        </div>
        `;
// Can the above div just be a self closing container: <div />

class OuterbasePluginTableConfiguration_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return observableAttributes;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateConfiguration.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(this);
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );
    this.config.tableValue = decodeAttributeByName(this, "tableValue");
    console.log(this.config.tableValue);
    this.config.theme = decodeAttributeByName(this, "metadata").theme;

    var element = this.shadow.getElementById("theme-container");
    element.classList.remove("dark");
    element.classList.add(this.config.theme);

    this.render();
  }

  render() {
    let sample = this.config.tableValue.length ? this.config.tableValue[0] : {};
    let keys = Object.keys(sample);
    console.log(keys);
    //  let newData = this.config.data;

    if (
      !keys ||
      keys.length === 0 ||
      !this.shadow.querySelector("#configuration-container")
    )
      return;

    this.shadow.querySelector("#configuration-container").innerHTML =
      `
        <div style="flex: 1;">
            <p class="field-title">First Value</p>
            <select id="firstValue">
                ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.firstValue ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `
            </select>

            <p class="field-title">Second Value</p>
            <select id="secondValue">
                ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.secondValue ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `
            </select>


            <p class="field-title">Third Value</p>
            <select id="thirdValue">
                ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.thirdValue ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `
            </select>

         
    

            <div style="margin-top: 8px;">
                <button id="saveButton">Save View</button>
            </div>
        </div>

     
        `;

    var saveButton = this.shadow.getElementById("saveButton");
    saveButton.addEventListener("click", () => {
      triggerEvent(this, {
        action: OuterbaseEvent.onSave,
        value: this.config.toJSON(),
      });
    });

    var firstValue = this.shadow.getElementById("firstValue");
    firstValue.addEventListener("change", () => {
      this.config.firstValue = firstValue.value;
      this.render();
    });

    var thirdValue = this.shadow.getElementById("thirdValue");
    thirdValue.addEventListener("change", () => {
      this.config.thirdValue = thirdValue.value;
      this.render();
    });

    var secondValue = this.shadow.getElementById("secondValue");
    secondValue.addEventListener("change", () => {
      this.config.secondValue = secondValue.value;
      this.render();
    });
  }
}

window.customElements.define(
  "outerbase-plugin-table-$PLUGIN_ID",
  OuterbasePluginTable_$PLUGIN_ID
);
window.customElements.define(
  "outerbase-plugin-configuration-$PLUGIN_ID",
  OuterbasePluginTableConfiguration_$PLUGIN_ID
);
