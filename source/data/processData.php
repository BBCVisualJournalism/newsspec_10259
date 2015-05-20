<?php
error_reporting(E_STRICT);
//run in strit
$csv = fopen(dirname(__FILE__) . '/dataset.csv', 'r');
$convicted = '';
$dead = '';
$rowIndex = 0;
$months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

while(($data = fgetcsv($csv, 0, ',')) !== false) {
    if ($rowIndex === 0) {
        $headers = $data;
        $rowIndex++;
        continue;
    }
    
    $id = (int) $data[array_search('id', $headers)];
    $thumbClassName = (strtolower($data[array_search('image', $headers)]) === 'y') ? $id: 'silhouette';
    $_name = trim($data[array_search('name', $headers)]);
    $name = ($_name !== '') ? $_name: 'Real name: Unconfirmed';
    $_aka = trim($data[array_search('aka', $headers)]);
    $aka = ($_aka !== '') ? "<h3 class=\"ns_facewall__alias\">Also known as: {$_aka}</h3>" : '';
    $age = $data[array_search('age', $headers)];
    $ageValue = ($age !== '') ? $age : 'Unconfirmed';
     
    $profile = $data[array_search('profile', $headers)];
    $category = trim(strtolower($data[array_search('category', $headers)]));
    $penportraitText = 'pp' . $category;
    $_group = trim($data[array_search('group', $headers)]);
    $group = ($_group !== '') ? 'group-' . str_replace(' ', '-', strtolower($_group)): 'group-unknown';
    $hometown = strtolower(trim($data[array_search('hometown', $headers)]));
    $offences = explode(',', $data[array_search('offences', $headers)]);
    $link = trim($data[array_search('link', $headers)]);
    $headline = trim($data[array_search('headline', $headers)]);
    $linkText = ($link!== '') ? "<a class=\"ns_facewall__storylink\" href=\"{$link}\" target=\"ns__linkout\">{$headline}</a>": '';

    echo "\n" . $id . ' ' . $thumbClassName . ' ' . $category;

    if ($age !== '') {
        if ($age <= 20) {
            $age = 'age-17-20';
        } else if ($age <= 25) {
            $age = 'age-21-25';
        } else if ($age <= 30) {
            $age = 'age-26-30';
        } else if ($age > 30) {
            $age = 'age-30';
        }
    } else {
        $age = 'age-unknown';
    }

    if ($category === 'dead') {
        $dateOfDeathText = 'Date of death';
        $ageText = 'Age';
        $liClassNames = "ns_facewall__item--{$age} ns_facewall__item--hometown-{$hometown}";
        $_month = trim($data[array_search('month_killed', $headers)]);
        $month = ($_month !== '') ? $months[(int)$_month - 1 ]: '';
        $dod = $month . ' ' . $data[array_search('year_killed', $headers)];
        $dateOfDeathConviction = (trim($dod) !== '') ? $dod: 'Unconfirmed';
        $groupOffence = 'Group';
        $groupOffenceNames = (trim($data[array_search('group', $headers)]) !== '') ? $data[array_search('group', $headers)]: 'Unconfirmed';
        $groupMarkup = "<span class=\"ns_facewall__group portrait__atrribute\">{$groupOffence}: {$groupOffenceNames}</span>";
    } else if ($category === 'convicted') {
        $dateOfDeathText = 'Date of conviction';
        $ageText = 'Age when convicted';
        $liClassNames = "ns_facewall__item--{$age}";
        $groupOffence = 'Offence';
        foreach ($offences as $offence) {
            if (trim($offence) !== '') {
                $_offence = strtolower(str_replace('.','', str_replace(' ', '-',trim($offence))));
                $liClassNames .= " ns_facewall__item--offence-{$_offence}";
            }
        }
        $month = (trim($data[array_search('sentence_month', $headers)]) !== '') ? $months[(int)$data[array_search('sentence_month', $headers)] - 1 ]: '';
        $doc = $data[array_search('sentence_day', $headers)] . ' ' . $month . ' ' . $data[array_search('sentence_year', $headers)];
        $dateOfDeathConviction = (trim($doc) !== '') ? $doc: 'Unconfirmed';
        $groupOffenceNames = (trim(implode('', $offences)) !== '') ? implode(', ', $offences): 'Unconfirmed';
        $groupMarkup = "<span class=\"ns_facewall__group portrait__atrribute\">{$groupOffence}: {$groupOffenceNames}</span>";
        // echo "\n $liClassNames \n";
    } else if ($category === 'alive') {
        // implement alive list
        $dateOfDeathText = 'Home town';
        $dateOfDeathConviction = trim($data[array_search('hometown', $headers)]);
        $ageText = 'Age when left UK';
        $hometown = trim($data[6]);
        $hometownClass = str_replace(' ', '-', strtolower($hometown));
        $gender = $data[array_search('gender', $headers)];
        $groupOffenceNames = (trim(implode('', $offences)) !== '') ? implode('', $offences): 'Unconfirmed';

        $liClassNames = "ns_facewall__item--{$age} ns_facewall__item--hometown-{$hometownClass} ns_facewall__item--gender-{$gender}";
        $groupMarkup = '';

    }

    $$category .= "
    <li class=\"ns_facewall__item {$liClassNames} ns_facewall__item--filtered\">
        <a class=\"ns_facewall__thumb ns_facewall__thumb--{$thumbClassName}\" href=\"#ns_facewall--{$id}\"><span>{$name}</span><span>Age: {$age}</span></a>
        <div class=\"ns_facewall__tooltip\">
            <span class=\"ns_facewall__tooltipname\">{$name}</span>
        </div>
    </li>";

    $$penportraitText .= "
    <li id=\"ns_facewall--{$id}\" class=\"ns_facewall__portrait\">
        <h2 class=\"ns_facewall__name\">{$name}</h2>
        <span class=\"ns_facewall__potrait-img ns_facewall__potrait-img--{$thumbClassName}\"></span>
        {$aka}
        <span class=\"ns_facewall__age portrait__atrribute\">{$ageText}: {$ageValue}</span>
        <span class=\"ns_facewall__dod portrait__atrribute\">{$dateOfDeathText}: {$dateOfDeathConviction}</span>
        {$groupMarkup}
        <p class=\"ns_facewall__profile portrait__atrribute\">{$profile}</p>
        {$linkText}
    </li>";

    file_put_contents(dirname(__FILE__) . '/../tmpl/facewall/list_dead.tmpl', $dead);
    file_put_contents(dirname(__FILE__) . '/../tmpl/facewall/list_convicted.tmpl', $convicted);
    file_put_contents(dirname(__FILE__) . '/../tmpl/facewall/list_alive.tmpl', $alive);

    file_put_contents(dirname(__FILE__) . '/../tmpl/facewall/portraits_dead.tmpl', $ppdead);
    file_put_contents(dirname(__FILE__) . '/../tmpl/facewall/portraits_convicted.tmpl', $ppconvicted);
    file_put_contents(dirname(__FILE__) . '/../tmpl/facewall/portraits_alive.tmpl', $ppalive);
    $rowIndex++;
}
?>