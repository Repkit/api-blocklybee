<?php

require_once 'vendor/curl/curl.php';
require_once 'vendor/kint/kint.php';
require_once 'abee/autoload.php';

$curl = new Curl;
$filter = new Filter;

$response; $countries; $response = $curl->get("https://trippublic.dcsplus.net/dynapack/clients/csb/public/api.php/static-data/countries", $vars = ["limit"=> '2', "page"=> '1']); $countries = json_decode($response);
d($countries);exit();

// get country by iso code FR
$filter->add('ISO', 'FR');
$response = $curl->get(StaticData::$countries, $vars = array('filter'=>$filter->toArray(),'limit'=>1));
$country = Parser::countries($response);
$countryId = $country['Id'];

// get first 10 cities for our country
$filter->reset()->add('CountryId', $countryId);
$response = $curl->get(StaticData::$cities, $vars = array('filter'=>$filter->toArray(),'limit'=>10));
$cities = Parser::cities($response);
var_dump($cities);