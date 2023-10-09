<?php

namespace KillBot;

class AntiBot {
    private $apiKey;

    /**
     * Constructor to initialize the AntiBot instance with an API key.
     *
     * @param string $apiKey The API key for KillBot.to
     */
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }

    /**
     * Method to check by providing the IP and the User-Agent.
     *
     * @param string $ip The user's IP address.
     * @param string $userAgent The user's User-Agent.
     *
     * @return array The response from the API.
     */
    public function check($ip, $userAgent) {
        try {
            $encodedUserAgent = urlencode($userAgent);
            $url = "https://killbot.to/api/antiBots/{$this->apiKey}/check?ip={$ip}&ua={$encodedUserAgent}";

            // Perform the HTTP request using file_get_contents
            $response = file_get_contents($url);

            if ($response === false) {
                throw new \Exception('Unable to fetch response from the API.');
            }

            return json_decode($response, true);
        } catch (\Exception $e) {
            return ['block' => false, 'error' => $e->getMessage()];
        }
    }
}
