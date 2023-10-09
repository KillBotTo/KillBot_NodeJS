# KillBot.to PHP AntiBot

KillBot is a Node.js module for checking and blocking potentially malicious requests based on IP and User-Agent information. It allows you to check whether your users are potentially malicious and, at the same time, retrieve information such as their location. Use of this module requires an API key and a subscription to the [KillBot.To](https://killbot.to/subscriptions) website.
```

## Usage

```php
<?php

// Assuming you have the autoload setup (e.g., through composer)
require 'vendor/autoload.php';

use KillBot\AntiBot;

// Your API key from KillBot.to
$apiKey = 'YOUR_API_KEY';

// Create an instance of the AntiBot class
$antiBot = new AntiBot($apiKey);

// IP and User-Agent to check
$userIP = '127.0.0.1';
$userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134';

try {
    // Check the user using the provided IP and User-Agent
    $result = $antiBot->check($userIP, $userAgent);

    // Process the result
    if ($result['block']) {
        echo 'User should be blocked. Reason: ' . $result['error'];
    } else {
        echo 'User is not blocked.';
    }
} catch (\Exception $e) {
    echo 'An error occurred: ' . $e->getMessage();
}

```

Replace 'your_api_key' with your actual API key from KillBot.to in both methods.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
