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
  tableValue = [];
  count = 0;
  page = 1;
  offset = 50;
  theme = "light";

  // Inputs from the configuration screen
  imageKey = undefined;
  optionalImagePrefix = undefined;
  titleKey = undefined;
  descriptionKey = undefined;
  subtitleKey = undefined;
  data = [];

  //

  // Variables for us to hold state of user actions
  deletedRows = [];

  constructor(object) {
    this.imageKey = object?.imageKey;
    this.optionalImagePrefix = object?.optionalImagePrefix;
    this.titleKey = object?.titleKey;
    this.descriptionKey = object?.descriptionKey;
    this.subtitleKey = object?.subtitleKey;
    //
    //this.data = object?.data;
  }

  toJSON() {
    return {
      imageKey: this.imageKey,
      imagePrefix: this.optionalImagePrefix,
      titleKey: this.titleKey,
      descriptionKey: this.descriptionKey,
      subtitleKey: this.subtitleKey,
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
    const decodedJSON = encodedJSON
      ?.replace(/&quot;/g, '"')
      ?.replace(/&#39;/g, "'");
    return decodedJSON ? JSON.parse(decodedJSON) : {};
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
  .lanes {
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
  
  .swim-lane {
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
      <script>
    
      
      </script>
      
      <div id="theme-container">
      <div class="container">
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

  //   connectedCallback() {
  //     this.render();
  //   }

  attributeChangedCallback() {
    if (this.getAttribute("configuration")) {
      this.config = new OuterbasePluginConfig_$PLUGIN_ID(
        decodeAttributeByName(this, "configuration")
      );
    }

    if (this.getAttribute("tableValue")) {
      this.config.tableValue = decodeAttributeByName(this, "tableValue");
    }
    //console.log(this.config.tableValue);

    // console.log(this.config.data);
    this.config.theme = decodeAttributeByName(this, "metadata").theme;

    var element = this.shadow.getElementById("theme-container");
    element.classList.remove("dark");
    element.classList.add(this.config.theme);

    /*

    connectedCallback() {
    const encodedTableJSON = this.getAttribute("configuration");
    console.log(encodedTableJSON);
    const decodedTableJSON = encodedTableJSON
      ?.replace(/&quot;/g, '"')
      ?.replace(/&#39;/g, "'");
    const configuration = JSON.parse(decodedTableJSON);

    if (configuration) {
      console.log(configuration);
      this.config = new OuterbasePluginConfig_$PLUGIN_ID(configuration);
    }

    // Set the items property to the value of the `tableValue` attribute.
    if (this.getAttribute("tableValue")) {
      const encodedTableJSON = this.getAttribute("tableValue");
      const decodedTableJSON = encodedTableJSON
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'");
      this.items = JSON.parse(decodedTableJSON);
    }





    */

    this.render();
  }

  render() {
    let sample = this.config.tableValue.length ? this.config.tableValue[0] : {};
    let keys = Object.keys(sample);
    console.log(keys);
    console.log("table", this.config);

    // if (
    //   !keys ||
    //   keys.length === 0 ||
    //   !this.shadow.querySelector("#theme-container")
    // )
    //   return;

    let cont = this.shadow.querySelector(".container");
    //  let RowData= this.config.data
    let html_old =
      `
        
        <div id='kanban-config'>
        
        
        <div>
                 
                      ` +
      keys.map(
        (key) =>
          `<label>
              <input type="checkbox" class="checkboxes"
              
              name=${key} value=${key}/>${key}
              </label><br>
                  
      
               
              `
      ) +
      `
      </div>
          <div style="margin-top: 8px;">
                    <button id="saveButton">Save View</button>
                </div>
    
        </div>
        
        
        `;

    let html = `  
      <div class="lanes">
      <div class="swim-lane" id="todo-lane">
      <h3 class="heading">TODO</h3>
      
      `;

    for (let i = 0; i < this.config.tableValue.length; i++) {
      html += `<div class="task"   draggable="true">`;
      if (this.config.data.length) {
        for (let j = 0; j < this.config.data.length; j++) {
          html += `<span>${
            this.config.tableValue[i][this.config.data[j]]
          }</span>`;
        }
      }
      html += `</div>`;
    }

    html += ` 
       
  
      
  
      </div>
          <div class="swim-lane">
          <h3 class="heading">Doing</h3>
  
          <div class="task" draggable="true">Binge 80 hours of Game of Thrones</div>
        </div>
  
        <div class="swim-lane">
        <h3 class="heading">Done</h3>
  
        <div class="task" draggable="true">
          Watch video of a man raising a grocery store lobster as a pet
        </div>
      </div>
  
      </div>
          
      
        
          
              
              
             
          
    
    
    
    
    
    
              `;
    cont.innerHTML = html;

    const draggables = this.shadow.querySelectorAll(".task");
    const droppables = this.shadow.querySelectorAll(".swim-lane");

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

    // var checkboxes = this.shadow.querySelectorAll(".checkboxes");
    // checkboxes.forEach((ev) => {
    //   //console.log(ev);
    //   ev.addEventListener("change", (e) => {
    //     if (ev.checked) {
    //       this.config.data = [...this.config.data, ev.name];
    //       console.log(this.config.data);
    //     } else {
    //       var index = this.config.data.indexOf(ev.name);
    //       if (index !== -1) {
    //         this.config.data.splice(index, 1);
    //       }
    //     }
    //     //  this.render();
    //     // console.log(e.checked, ev.checked);

    //     // console.log(this.config.data);
    //   });
    // });

    // this.shadow.querySelectorAll(".task").forEach((e) => {
    //   if (!this.config.data) e.style.display = "none";
    //   else e.style.display = "block";
    // });
    // var saveButton = this.shadow.getElementById("saveButton");
    // saveButton.addEventListener("click", () => {
    //   console.log("clicked");
    //   triggerEvent(this, {
    //     action: OuterbaseEvent.onSave,
    //     value: this.config.toJSON(),
    //   });
    //   console.log(this.config);
    //   this.render();
    // });

    this.shadow.querySelectorAll(".kanban-block").forEach((el, index) => {
      el.addEventListener("dragstart", (e) => {
        console.log(e.target.id);
        //console.log(document.getElementsByName(e.target.id));
        // console.log();
        e.dataTransfer.setData("text", e.target.id);
      });
    });

    this.shadow.querySelectorAll(".kanban-block").forEach((el, index) => {
      el.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
    });
    this.shadow.querySelectorAll(".kanban-block").forEach((el, index) => {
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        //console.log(ev);
        var data = e.dataTransfer.getData("text");
        console.log(data);
        //  console.log(document.getElementById("task0"));
        e.target.appendChild(this.shadow.getElementById(data));
      });
    });

    const drag = (ev) => {
      console.log(ev.target.id);
      console.log(document.getElementsByName(ev.target.id));
      console.log();
      ev.dataTransfer.setData("text", ev.target.id);
    };
    //  this.shadow.querySelector()

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

    const markSoldButtons = this.shadow.querySelectorAll(".markSoldButton");
    markSoldButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        let row = this.config.tableValue[index];

        fetch("https://adjacent-apricot.cmd.outerbase.io/mark-sold", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id: row.id,
          }),
        });

        // triggerEvent(this, {
        //     action: OuterbaseTableEvent.updateRow,
        //     value: row
        // })
      });
    });

    // var createRowButton = this.shadow.getElementById("createRowButton");
    // createRowButton.addEventListener("click", () => {
    //   let row = {
    //     id: 0,
    //     make_id: "Outerbase",
    //     model: "Spacecar",
    //     year: 2047,
    //     vin: "SPCMN404NOREGRETS",
    //     color: "Purple",
    //     price: 42069000,
    //     city: "Pittsburgh",
    //     state: "Pennsylvania",
    //     postal: 15203,
    //     longitude: 58.4767,
    //     latitude: -16.1003,
    //     description: "The best space car money can buy.",
    //     seller: "mr_base",
    //     seller_name: "Outer Base",
    //     image:
    //       "https://images.unsplash.com/photo-1506469717960-433cebe3f181?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
    //     image_thumb:
    //       "https://images.unsplash.com/photo-1506469717960-433cebe3f181?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
    //   };
    //   this.config.tableValue.push(row);
    //   this.render();

    //   triggerEvent(this, {
    //     action: OuterbaseTableEvent.createRow,
    //     value: row,
    //   });
    // });

    // var previousPageButton = this.shadow.getElementById("previousPageButton");
    // previousPageButton.addEventListener("click", () => {
    //   triggerEvent(this, {
    //     action: OuterbaseTableEvent.getPreviousPage,
    //     value: {},
    //   });
    // });

    // var nextPageButton = this.shadow.getElementById("nextPageButton");
    // nextPageButton.addEventListener("click", () => {
    //   triggerEvent(this, {
    //     action: OuterbaseTableEvent.getNextPage,
    //     value: {},
    //   });
    // });
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

  //   connectedCallback() {
  //     this.render();
  //   }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(this);
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );
    this.config.tableValue = decodeAttributeByName(this, "tableValue");
    console.log(this.config.tableValue);
    this.config.theme = decodeAttributeByName(this, "metadata");

    var element = this.shadow.getElementById("theme-container");
    element.classList.remove("dark");
    element.classList.add(this.config.theme);

    this.render();
  }

  render() {
    let sample = this.config.tableValue.length ? this.config.tableValue[0] : {};
    let keys = Object.keys(sample);
    console.log(keys);
    let newData = this.config.data;

    if (
      !keys ||
      keys.length === 0 ||
      !this.shadow.querySelector("#configuration-container")
    )
      return;

    this.shadow.querySelector("#configuration-container").innerHTML =
      `
              <div>
  
                      ` +
      keys.map(
        (key) =>
          `<label>
              <input type="checkbox" class="checkboxes"
              check=${newData.includes(key) ? `true` : `false`}
              name=${key} value=${key}/>${key}
              </label><br>
  
              `
      ) +
      `
          </div>
          <div style="margin-top: 8px;">
                    <button id="saveButton">Save View</button>
                </div>`;

    let data = this.config.data;

    var checkboxes = this.shadow.querySelectorAll(".checkboxes");
    checkboxes.forEach((ev) => {
      //console.log(ev);
      ev.addEventListener("change", (e) => {
        if (ev.checked) {
          data = [...data, ev.name];
          this.config.data = data;
          //  this.render();
          // console.log(this.config.data);
        } else {
          var index = data.indexOf(ev.name);
          if (index !== -1) {
            data.splice(index, 1);
          }
          this.config.data = data;
          // this.render();
        }
      });
    });

    var saveButton = this.shadow.getElementById("saveButton");
    saveButton.addEventListener("click", () => {
      // let configuration= this.config.data;
      //this.config.data = data;
      // this.render();
      triggerEvent(this, {
        action: OuterbaseEvent.onSave,
        value: this.config.toJSON(),
      });

      console.log("clicked");

      console.log(this.config);
      //  this.render();
    });
    //this.render();
    // console.log(e.checked, ev.checked);

    // console.log(this.config.data);

    // var imageKeySelect = this.shadow.getElementById("imageKeySelect");
    // imageKeySelect.addEventListener("change", () => {
    //   this.config.imageKey = imageKeySelect.value;
    //   this.render();
    // });

    // var titleKeySelect = this.shadow.getElementById("titleKeySelect");
    // titleKeySelect.addEventListener("change", () => {
    //   this.config.titleKey = titleKeySelect.value;
    //   this.render();
    // });

    // var descriptionKeySelect = this.shadow.getElementById(
    //   "descriptionKeySelect"
    // );
    // descriptionKeySelect.addEventListener("change", () => {
    //   this.config.descriptionKey = descriptionKeySelect.value;
    //   this.render();
    // });

    // var subtitleKeySelect = this.shadow.getElementById("subtitleKeySelect");
    // subtitleKeySelect.addEventListener("change", () => {
    //   this.config.subtitleKey = subtitleKeySelect.value;
    //   this.render();
    // });
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
