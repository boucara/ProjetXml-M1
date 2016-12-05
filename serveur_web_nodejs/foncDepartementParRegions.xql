for $i in collection("monuments")//row
where $i//REG="Provence-Alpes-Côte d'Azur"
order by $i//DPT
return $i//DPT
