<?php
namespace MSHR\zScoreCalculator;

use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;

class zScoreCalculator extends AbstractExternalModule {

     private function getProjectSettingSingleKey($settingKey, $subKey, $index) {
    $settings = $this->getProjectSetting($settingKey) ?? [];
    if (isset($settings[$index][$subKey])) {
        return $settings[$index][$subKey];
    }

    $directSettings = $this->getProjectSetting($subKey) ?? [];
    return $directSettings[$index] ?? '';
    }

    private function log($message) {
    $enableLogging = $this->getProjectSetting('enable-logging') === true;
    if ($enableLogging) {
        echo "<script>console.log(" . json_encode($message) . ");</script>";
    

    
}

}
public function redcap_data_entry_form($project_id) {
    $this->log('HOOK FIRED - zScoreCalculator active');
    
    $currentInstrument = $this->escape($_GET['page'] ?? '');
    $enabledInstruments = $this->getProjectSetting('enabled-instruments') ?? [];

    $this->log("Current Instrument: '$currentInstrument'");
    $this->log('Enabled Instruments: ', "$enabledInstruments");
    
    if (!is_array($enabledInstruments)) {
        $enabledInstruments = $enabledInstruments ? [$enabledInstruments] : [];
    }

    if (!in_array($currentInstrument, $enabledInstruments)) {
       $this->log("Instrument '$currentInstrument' not enabled, exiting");
        return;
    }

    $scripts = [
        'js/otwoboys.js', 'js/utwoboys.js', 
        'js/otwogirls.js', 'js/utwogirls.js',
        'js/zScoreCalc.js'
    ];
    
    foreach ($scripts as $path) {
        $url = $this->getUrl($path);
        echo "<script src='$url'></script>";
    }

   $this->log('SCRIPTS loaded');

    // Get number of fieldsets from input-fields array length
    $inputFields = $this->getProjectSetting('input-fields') ?? [];
    $numSets = count($inputFields);
    
    $this->log('Processing $numSets field sets');

    for ($index = 0; $index < $numSets; $index++) {
        // get individual fields per set
        $heightField = $this->getProjectSettingSingleKey('input-fields', 'height-field', $index) ?? '';
        $weightField = $this->getProjectSettingSingleKey('input-fields', 'weight-field', $index) ?? '';
        $ageField    = $this->getProjectSettingSingleKey('input-fields', 'age-field', $index) ?? '';
        $sexField    = $this->getProjectSettingSingleKey('input-fields', 'sex-field', $index) ?? '';
        $zscoreField = $this->getProjectSettingSingleKey('input-fields', 'zscore-field', $index) ?? '';

       $this->log([
            'set' => $index,
            'height' => $heightField,
            'weight' => $weightField,
            'age' => $ageField,
            'sex' => $sexField,
            'zscore' => $zscoreField
        ]);

        // ensure complete sets
        if ($heightField && $weightField && $ageField && $sexField && $zscoreField) {
            echo "<script>
                $(document).ready(function() {
                    window.attachZScoreListeners(
                        " . json_encode($heightField) . ",
                        " . json_encode($weightField) . ",
                        " . json_encode($ageField) . ",
                        " . json_encode($sexField) . ",
                        " . json_encode($zscoreField) . "
                    );
                });
            </script>";
        } else {
           $this->log('Set $index incomplete, skipping');
        }
    }
}

}







/*
    public function redcap_data_entry_form($project_id) {
        // ALWAYS log first line - if this doesn't show, hook is dead
        echo "<script>console.log('HOOK FIRED - zScoreCalculator active');
        
        $currentInstrument = $_GET['page'] ?? '';
        $enabledInstruments = $this->getProjectSetting('enabled-instruments') ?? [];

        echo "<script>console.log('HOOK FIRED - Got Current Instrument');
        
        echo "<script>console.log('Instrument: \"' + '$currentInstrument' + '\", Enabled: ', " . json_encode($enabledInstruments) . ");
        
        if (!is_array($enabledInstruments)) {
            $enabledInstruments = $enabledInstruments ? [$enabledInstruments] : [];
        }

        echo "<script>console.log('After array search');
        // Get ALL fields FIRST
        $heightFields = $this->getProjectSetting('height-field') ?? [];
        $weightFields = $this->getProjectSetting('weight-field') ?? [];
        $ageFields = $this->getProjectSetting('age-field') ?? [];
        $sexFields = $this->getProjectSetting('sex-field') ?? [];
        $zscoreFields = $this->getProjectSetting('zscore-field') ?? [];

        echo "<script>console.log('Field sets found: ', " . json_encode($heightFields) . ");

        echo "<script>console.log('LOADING SCRIPTS');
    
    // Load scripts ONCE with getUrl()
        $scripts = [
            'js/otwoboys.js',
            'js/utwoboys.js', 
            'js/otwogirls.js',
            'js/utwogirls.js',
            'js/zScoreCalc.js'
        ];
        
        foreach ($scripts as $path) {
            $url = $this->getUrl($path);
            echo "<script src='$url'></script>";
        }

        echo "<script>console.log('SCRIPTS loaded');</script>";
        echo "<script>
           console.log('$heightFields');
            </script>";
        foreach ($heightFields as $index => $heightField) {
            $weightField = $weightFields[$index] ?? '';
            $ageField    = $ageFields[$index] ?? '';
            $sexField    = $sexFields[$index] ?? '';
            $zscoreField = $zscoreFields[$index] ?? '';
            echo "<script>
           console.log('$heightField', '$weightField', '$ageField', '$sexField', '$zscoreField');
            </script>";

            echo "<script>
            $(document).ready(function() {
                window.attachZScoreListeners('$heightField', '$weightField', '$ageField', '$sexField', '$zscoreField');
            });
        </script>";
            break; // Only first valid set
        }
    }
}

*/