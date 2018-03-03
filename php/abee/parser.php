<?php

class Parser
{
    public static function __callStatic($name, $arguments)
    {
        $json = implode(', ', $arguments);
        $data = json_decode($json, true);
        if(isset($data['_embedded'])){
            $collection = $data['_embedded'][$name];
            if(count($collection) == 1){
                $collection = reset($collection);
            }
        }else{
            //assume there is an entity returned
            $collection = $data;
        }
        return $collection;
    }
}