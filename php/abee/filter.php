<?php

class Filter
{
    private $_data = array();
    
    public function add($name, $term)
    {
        array_push($this->_data, array('name' => $name, 'term'=>$term));
        return $this;
    }
    
    public function toArray()
    {
        return $this->_data;
        // return array('filter'=>$this->_data);    
    }
    
    public function reset()
    {
        $this->_data = array();
        return $this;
    }
}