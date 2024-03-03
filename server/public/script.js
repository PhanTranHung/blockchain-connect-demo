const contractFunctionsDiv = document.getElementById("contract-functions");
contractFunctionsDiv.innerHTML = `<p id="loading-message">Loading contract functions...</p>`;

fetch("/smartcontract/abi")
  .then((response) => response.json())
  .then((abi) => {
    const functionsDiv = document.createElement("div");

    abi.forEach((item) => {
      if (item.type === "function") {
        const functionItem = document.createElement("div");
        functionItem.classList.add("function-item");

        const functionName = document.createElement("h3");
        functionName.classList.add("function-name");
        functionName.textContent = item.name;
        functionItem.appendChild(functionName);

        const functionParams = document.createElement("div");
        functionParams.classList.add("function-params");

        item.inputs.forEach((param) => {
          const paramDiv = document.createElement("div");
          paramDiv.classList.add("function-param");

          const label = document.createElement("label");
          label.textContent = param.name;
          paramDiv.appendChild(label);

          const input = document.createElement("input");
          input.type = "text";
          paramDiv.appendChild(input);

          functionParams.appendChild(paramDiv);
        });

        const callButton = document.createElement("button");
        callButton.textContent = "Call";
        callButton.addEventListener("click", () => {
          const params = [];
          functionParams.querySelectorAll("input").forEach((input) => {
            params.push(input.value);
          });

          const viewOnly = item.stateMutability === "view"; // Check for view stateMutability

          const responseDiv = document.createElement("div");
          responseDiv.classList.add("function-response");
          responseDiv.textContent = "Calling function...";
          functionItem.appendChild(responseDiv);

          fetch("/smartcontract", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              functionName: item.name,
              params: params,
              viewOnly: viewOnly, // Add viewOnly property
            }),
          })
            .then((response) => response.text())
            .then((responseText) => {
              responseDiv.textContent = JSON.stringify(responseText);
            })
            .catch((error) => {
              responseDiv.textContent = "Error: " + error.message;
            });
        });

        functionItem.appendChild(functionParams);
        functionItem.appendChild(callButton);

        functionsDiv.appendChild(functionItem);
      }
    });

    contractFunctionsDiv.replaceChild(
      functionsDiv,
      document.getElementById("loading-message")
    );
  })
  .catch((error) => {
    contractFunctionsDiv.textContent = "Error: " + error.message;
  });
