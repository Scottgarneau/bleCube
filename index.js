const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHARACTERISTIC_UUID_TX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let bleDevice;
let txCharacteristic;
let isConnected = false;

async function connect() {
  try {
    // Disable the connect button while connecting
    const connectButton = document.querySelector(".connect");
    connectButton.disabled = true;
    connectButton.textContent = "Connecting...";

    console.log("Inside connect function");

    // Request the device
    console.log("Requesting device...");
    bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "S" }],
      optionalServices: [SERVICE_UUID], // Add the service UUID to optionalServices
    });
    console.log("Device requested successfully:", bleDevice);

    // Connect to the device
    console.log("Connecting to device...");
    const server = await bleDevice.gatt.connect();
    console.log("Device connected successfully:", server);

    // Get the service
    console.log("Getting primary service...");
    const service = await server.getPrimaryService(SERVICE_UUID);
    console.log("Primary service obtained successfully:", service);

    // Get the TX characteristic
    console.log("Getting characteristic...");
    txCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID_TX);
    console.log("Characteristic obtained successfully:", txCharacteristic);

    // Subscribe to notifications
    console.log("Subscribing to notifications...");
    await txCharacteristic.startNotifications();
    txCharacteristic.addEventListener("characteristicvaluechanged", handleData);
    console.log("Notifications subscribed successfully.");

    // Update UI to indicate successful connection
    // Hide the connect UI and show the main UI
    console.log("Updating UI...");
    document.querySelector(".connect-ui").classList.add("hide");
    document.querySelector(".ui").classList.remove("hide");
    console.log("UI updated.");

    isConnected = true;
    updateButton();
  } catch (error) {
    console.error("Error connecting:", error);
    // Display error message to the user
    const errorElement = document.querySelector(".error");
    errorElement.classList.remove("hide");
    errorElement.textContent = "Error connecting: " + error;

    // Hide the error message after 10 seconds
    setTimeout(() => {
      errorElement.classList.add("hide");
    }, 5000);
  } finally {
    // Enable the connect button regardless of the connection result
    const connectButton = document.querySelector(".connect");
    connectButton.disabled = false;
    connectButton.textContent = "Click to Connect";
  }
}

// Rest of the code remains the same...

async function disconnect() {
  try {
    if (bleDevice && bleDevice.gatt.connected) {
      // Disconnect from the device
      console.log("Disconnecting from device...");
      await bleDevice.gatt.disconnect();
      console.log("Disconnected successfully.");

      // Update UI to indicate disconnection
      document.querySelector(".connect-ui").classList.remove("hide");
      document.querySelector(".ui").classList.add("hide");

      isConnected = false;
      updateButton();
    } else {
      console.log("No device connected.");
    }
  } catch (error) {
    console.error("Error disconnecting:", error);
  } finally {
    bleDevice = null; // Reset bleDevice
    txCharacteristic = null; // Reset txCharacteristic
  }
}

function updateButton() {
  const disconnectButton = document.querySelector(".disconnect");
  if (isConnected) {
    disconnectButton.textContent = "Disconnect";
  } else {
    disconnectButton.textContent = "Connect";
  }
}

// Call the connect function when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded.");

  // Add this code to add the 'animate' class once the DOM content is loaded
  var containerWrapper = document.querySelector(".container-wrapper");
  console.log(containerWrapper); // Check if .container-wrapper element is found

  // Remove 'animate' class if it exists
  containerWrapper.classList.remove("animate");

  // Trigger reflow before adding the class again
  containerWrapper.offsetWidth; // This line forces the browser to reflow the element

  containerWrapper.classList.add("animate");
  console.log("Animate class added"); // Confirm if the class is added

  // Add event listener to the connect button
  document.querySelector(".connect").addEventListener("click", connect);

  // Add event listener to the disconnect button
  document.querySelector(".disconnect").addEventListener("click", function () {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  });
});

let theme = "Mango";
function changeTheme(newTheme) {
  theme = newTheme;
  console.log("Changing theme to:", theme);

  for (let i = 0; i <= 10; i++) {
    const label = document.querySelector(`.label-${i}`);
    if (!label) continue; // Skip if label not found

    if (theme === "Neon") {
      label.classList.add("neon");
    } else if (theme === "Mango") {
      label.classList.remove("neon");
    }
  }

  const cube = document.querySelector(".cube"); // Get the cube element

  if (!cube) return; // Return if cube element not found

  if (theme === "Neon") {
    cube.classList.add("neon");
  } else if (theme === "Mango") {
    cube.classList.remove("neon");
  }

  // Handle 'connected' button color
  const button = document.querySelector("button.connect");

  if (theme === "Neon") {
    button.classList.add("neon");
  } else if (theme === "Mango") {
    button.classList.remove("neon");
  }
  const buttonConnected = document.querySelector("button.connected");

  if (theme === "Neon") {
    buttonConnected.classList.add("neon");
  } else if (theme === "Mango") {
    buttonConnected.classList.remove("neon");
  }
}
function handleData(event) {
  console.log("Inside handleData function");
  // Indicate that the function is being invoked
  console.log("handleData function is invoked.");
  for (let i = 0; i <= 10; i++) {
    const label = document.querySelector(`.label-${i}`);
    if (!label) continue; // Skip if label not found

    if (theme === "Neon") {
      label.classList.add("neon");
    } else if (theme === "Mango") {
      label.classList.remove("neon");
    }
  }

  // Get the value from the characteristic
  const value = event.target.value;

  if (value && value.byteLength > 0) {
    // Assuming the data is UTF-8 encoded
    const receivedText = new TextDecoder().decode(value);
    console.log("Received data:", receivedText);

    // Call changeTheme function to update the UI theme
    changeTheme(theme); // Set the theme to Neon every time new data is received

    // Split the received text by space
    const numbers = receivedText.trim().split(" ");

    // Check if there are exactly 6 numbers
    if (numbers.length !== 6) {
      // Display error message for incorrect number of values
      console.error("Error: Expected 6 numbers, but received:", numbers.length);
      document.getElementById("receivedData").textContent =
        "Error: Expected 6 numbers, but received " + numbers.length;
      return;
    }

    // Clear previous content
    document.getElementById("receivedData").innerHTML = "";

    // Display each number on a separate line with corresponding labels
    const labels = [
      "▋         ",
      "▋         ",
      "▋▋        ",
      "▋▋▋       ",
      "▋▋▋▋      ",
      "▋▋▋▋▋     ",
      "▋▋▋▋▋▋    ",
      "▋▋▋▋▋▋▋   ",
      "▋▋▋▋▋▋▋▋  ",
      "▋▋▋▋▋▋▋▋▋ ",
      "▋▋▋▋▋▋▋▋▋▋",
    ];

    let lineNumber = 1; // Counter for preceding numbers
    for (let i = 0; i < numbers.length; i++) {
      // Skip the second integer (index 1)

      let labelIndex;
      const num = parseInt(numbers[i]);
      let labelClass; // Variable to store the label class for the block

      if (isNaN(num)) {
        // Display error message for invalid values
        console.error("Error: Invalid number format:", numbers[i]);
        document.getElementById("receivedData").textContent =
          "Error: Invalid number format: " + numbers[i];
        return;
      } else if (num < 1) {
        labelIndex = 0;
      } else if (num < 10) {
        labelIndex = 1;
      } else if (num < 20) {
        labelIndex = 2;
      } else if (num < 30) {
        labelIndex = 3;
      } else if (num < 40) {
        labelIndex = 4;
      } else if (num < 50) {
        labelIndex = 5;
      } else if (num < 60) {
        labelIndex = 6;
      } else if (num < 70) {
        labelIndex = 7;
      } else if (num < 80) {
        labelIndex = 8;
      } else if (num < 90) {
        labelIndex = 9;
      } else {
        labelIndex = 10;
      }

      // Assign label class based on the label index
      if (theme === "Neon") {
        switch (labelIndex) {
          case 0:
            labelClass = "label-0 neon";
            break;
          case 1:
            labelClass = "label-1 neon";
            break;
          case 2:
            labelClass = "label-2 neon";
            break;
          case 3:
            labelClass = "label-3 neon";
            break;
          case 4:
            labelClass = "label-4 neon";
            break;
          case 5:
            labelClass = "label-5 neon";
            break;
          case 6:
            labelClass = "label-6 neon";
            break;
          case 7:
            labelClass = "label-7 neon";
            break;
          case 8:
            labelClass = "label-8 neon";
            break;
          case 9:
            labelClass = "label-9 neon";
            break;
          case 10:
            labelClass = "label-10 neon";
            break;
          default:
            labelClass = "red-label";
        }
      } else {
        // For "Mango" theme, no need to append ".neon"
        switch (labelIndex) {
          case 0:
            labelClass = "label-0";
            break;
          case 1:
            labelClass = "label-1";
            break;
          case 2:
            labelClass = "label-2";
            break;
          case 3:
            labelClass = "label-3";
            break;
          case 4:
            labelClass = "label-4";
            break;
          case 5:
            labelClass = "label-5";
            break;
          case 6:
            labelClass = "label-6";
            break;
          case 7:
            labelClass = "label-7";
            break;
          case 8:
            labelClass = "label-8";
            break;
          case 9:
            labelClass = "label-9";
            break;
          case 10:
            labelClass = "label-10";
            break;
          default:
            labelClass = "red-label";
        }
      }

      const label = labels[labelIndex];
      const formattedText = `<span class="${labelClass}">${lineNumber++}: ${label}</span>`;
      const div = document.createElement("div");
      div.innerHTML = formattedText;
      document.getElementById("receivedData").appendChild(div);
    }

    // Cube animation control based on the first two numbers in the received data
    const flip = parseInt(numbers[0]);

    let torqueX = parseInt(numbers[2]);
    let torqueY = parseInt(numbers[3]);
    let torqueZ = parseInt(numbers[1]);
    let zoomInValue = parseInt(numbers[4]);
    let zoomOutValue = parseInt(numbers[5]);
    if (flip >= 5) {
      torqueX = -parseInt(numbers[2]);
      torqueY = -parseInt(numbers[3]);
      torqueZ = -parseInt(numbers[1]);
      zoomInValue = -parseInt(numbers[4]);
      zoomOutValue = -parseInt(numbers[5]);
    }

    // Rotate the cube based on the torque values
    transformCube(torqueX, torqueY, torqueZ, zoomInValue, zoomOutValue);
  } else {
    // If no value is received, display "No value read"
    console.log("No value received.");
    document.getElementById("receivedData").textContent = "No value read";
  }
}

let totalRotationX = 0;
let totalRotationY = 0;
let totalRotationZ = 0;
let cumulativeZoom = 1;

function transformCube(torqueX, torqueY, torqueZ, zoomInValue, zoomOutValue) {
  const cube = document.getElementById("cube");
  cube.style.setProperty("--animation-speed", "0.2s");
  // Add the new rotation to the total rotation

  totalRotationX += torqueY / 40; // Use torqueY for the X-axis rotation

  totalRotationX = Math.min(Math.max(totalRotationX, -90), 90);
  totalRotationY -= torqueX / 2; // Use negative torqueX for the Y-axis rotation
  totalRotationZ += (0 * torqueZ) / 10; // Use torqueZ for the Z-axis rotation

  // Calculate the scale factor for zooming
  let scaleFactor = cumulativeZoom;

  if (zoomInValue !== 0) {
    scaleFactor *= 1 + zoomInValue / 2000; // Zoom in by adding to 1
  } else if (zoomOutValue !== 0) {
    scaleFactor *= 1 - zoomOutValue / 3000; // Zoom out by subtracting from 1
  }

  // Ensure scaleFactor stays within the desired range
  scaleFactor = Math.min(Math.max(scaleFactor, 0.5), 1.6);

  // Update cumulativeZoom
  cumulativeZoom = scaleFactor;

  // Apply the total rotation angles and scale to the cube
  cube.style.transform = `rotateX(${totalRotationX}deg) rotateY(${totalRotationY}deg) rotateZ(${totalRotationZ}deg) scale3d(${scaleFactor}, ${scaleFactor}, ${scaleFactor})`;
}

// Define the Events object
var events = new Events();
events.add = function (obj) {
  obj.events = {};
};
events.implement = function (fn) {
  fn.prototype = Object.create(Events.prototype);
};

function Events() {
  this.events = {};
}

Events.prototype.on = function (name, fn) {
  var events = this.events[name];
  if (events == undefined) {
    this.events[name] = [fn];
    this.emit("event:on", fn);
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
      this.emit("event:on", fn);
    }
  }
  return this;
};

Events.prototype.once = function (name, fn) {
  var events = this.events[name];
  fn.once = true;
  if (!events) {
    this.events[name] = [fn];
    this.emit("event:once", fn);
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
      this.emit("event:once", fn);
    }
  }
  return this;
};

Events.prototype.emit = function (name, args) {
  var events = this.events[name];
  if (events) {
    var i = events.length;
    while (i--) {
      if (events[i]) {
        events[i].call(this, args);
        if (events[i].once) {
          delete events[i];
        }
      }
    }
  }
  return this;
};

Events.prototype.unbind = function (name, fn) {
  if (name) {
    var events = this.events[name];
    if (events) {
      if (fn) {
        var i = events.indexOf(fn);
        if (i != -1) {
          delete events[i];
        }
      } else {
        delete this.events[name];
      }
    }
  } else {
    delete this.events;
    this.events = {};
  }
  return this;
};

var userPrefix;

var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ""),
    pre = (Array.prototype.slice
      .call(styles)
      .join("")
      .match(/-(moz|webkit|ms)-/) ||
      (styles.OLink === "" && ["", "o"]))[1],
    dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1];
  userPrefix = {
    dom: dom,
    lowercase: pre,
    css: "-" + pre + "-",
    js: pre[0].toUpperCase() + pre.substr(1),
  };
})();

function bindEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else {
    element.attachEvent("on" + type, handler);
  }
}

function Viewport(data) {
  events.add(this);

  var self = this;

  this.element = data.element;
  this.fps = data.fps;
  this.sensivity = data.sensivity;
  this.sensivityFade = data.sensivityFade;
  this.touchSensivity = data.touchSensivity;
  this.speed = data.speed;

  this.lastX = 0;
  this.lastY = 0;
  this.mouseX = 0;
  this.mouseY = 0;
  this.distanceX = 0;
  this.distanceY = 0;
  this.positionX = 1122;
  this.positionY = 136;
  this.torqueX = 0;
  this.torqueY = 0;

  this.down = false;
  this.upsideDown = false;

  this.previousPositionX = 0;
  this.previousPositionY = 0;

  this.currentSide = 0;
  this.calculatedSide = 0;
}
events.implement(Viewport);
