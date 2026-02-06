## Configuration and CRM integration instructions

This script enables secure communication between a Dynamics CRM form and an embedded Next.js iframe app.

### Important configuration

You **must** set `iframeControlName` and `iframeOrigin` correctly for each environment. This can be done in the `CONFIG` object in the script, or in the `onLoad` function.

- **`iframeControlName`**: The name of the iframe control on the Dynamics form.
- **`iframeOrigin`**: The origin hosting the Next.js app (must match `postMessage` `targetOrigin`).

### How to add this script to a Dynamics CRM form

1. Upload the script file (for example `iframe-messaging.js`) as a JavaScript web resource in your Dynamics CRM instance.

2. On your CRM edit form:
   1. Go to **Form Editor**
   2. Click **Form Properties**
   3. Add the JavaScript web resource to the form libraries

3. Initialise on **Tab State Change**:
   1. Select the tab containing your iframe
   2. Go to the tab’s **Events** → **On Tab State Change**
   3. Add a new event handler:
      - **Library**: your JS web resource (for example `iframe-messaging.js`)
      - **Function**: `IframeMessenger.onLoad`
      - **Pass execution context as first parameter**: enabled (checkbox checked)
   4. Optionally, add a **Run OnLoad** event for the tab if you want messaging to start as soon as the tab is loaded

4. Save and publish the form.
