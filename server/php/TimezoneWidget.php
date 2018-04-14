<?php

class TimezoneHelper {

    const TZ_REGIONS = array(
        \DateTimeZone::AFRICA => "Africa",
        \DateTimeZone::AMERICA => "America",
        \DateTimeZone::ANTARCTICA => "Antarctica",
        \DateTimeZone::ASIA => "Asia",
        \DateTimeZone::ATLANTIC => "Atlantic",
        \DateTimeZone::AUSTRALIA => "Australia",
        \DateTimeZone::EUROPE => "Europe",
        \DateTimeZone::INDIAN => "Indian",
        \DateTimeZone::PACIFIC => "Pacific",
    );


    const TZ_REGION_SYSTEM_US = 1024;

    const TZ_REGION_DEFAULT = \DateTimeZone::AMERICA;
    const TIMEZONE_DEFAULT = 'America/New_York';

    public static function timezoneValues() {
        $us_timezones = [
            'America/New_York', 
            'America/Chicago',
            'America/Denver',
            'America/Los_Angeles',
            'America/Anchorage',
            'Pacific/Honolulu'
        ];

        $objUS = new \stdClass();
        $objUS->id = self::TZ_REGION_SYSTEM_US;
        $objUS->label = "United States";
        $objUS->timezones = [];

        foreach ($us_timezones as $timezone) {
            $tz = new \DateTimeZone($timezone);

            $dateTime = new \DateTime(); 
            $dateTime->setTimeZone($tz); 

            $offset = $tz->getOffset($dateTime);

            $tzObj = new \stdClass();
            $tzObj->labels = [$timezone];
            $tzObj->offsetNumber = $offset;

            $offset_prefix = $offset < 0 ? '-' : '+';
            $offset_formatted = gmdate( 'H:i', abs($offset) );

            $pretty_offset = $dateTime->format('T') . " (UTC${offset_prefix}${offset_formatted})";

            $tzObj->offsetLabel = $pretty_offset;

            $objUS->timezones[] = $tzObj;
        }

        $timezones = [
            $objUS
        ];
        foreach( self::TZ_REGIONS as $region => $label )
        {
            $region_timezones = [];

            $region_info = \DateTimeZone::listIdentifiers( $region );
            $labels = \DateTimeZone::listIdentifiers( $region );
            foreach ($labels as $label) {
                $tz = new \DateTimeZone($label); 
                $offset = $tz->getOffset(new \DateTime);
                if (array_key_exists($offset, $region_timezones)) {
                    $region_timezones[$offset]->labels[] = $label;
                } else {
                    $tzObj = new \stdClass();
                    $tzObj->labels = [$label]; 
                    $tzObj->offsetNumber = $offset;

                    $offset_prefix = $offset < 0 ? '-' : '+';
                    $offset_formatted = gmdate( 'H:i', abs($offset) );

                    $pretty_offset = "UTC${offset_prefix}${offset_formatted}";

                    $tzObj->offsetLabel = $pretty_offset;

                    $region_timezones[$offset] = $tzObj;
                }
            }

            // sort timezone by offset
            ksort($region_timezones);

            $regionObj = new \stdClass();
            $regionObj->id = $region;
            $regionObj->label = self::TZ_REGIONS[$region];
            $regionObj->timezones = array_values($region_timezones);

            $timezones[] = $regionObj;
        }

        return $timezones;
    }

    public static function validateTimezone($name, $regionid = null) {
        $tzData = self::timezoneValues();

        $regionValid = false;
        if ($regionid == null) {
            $regionValid = true;
        }
        $nameValid = false;

        $usa = true;
        foreach ($tzData as $region) {
            foreach ($region->timezones as $timezone) {
                foreach ($timezone->labels as $label) {
                    if ($name == $label) {
                        if (!$regionValid) {
                            if ($regionid == 1024 && $usa) {
                                return true;
                            } else if (self::TZ_REGIONS[$region->id] != $regionid) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }
            $usa = false;
        }

        return false;
    }

    public static function regionForTimezone($name) {
        $tzData = self::timezoneValues();

        foreach ($tzData as $region) {
            foreach ($region->timezones as $timezone) {
                foreach ($timezone->labels as $label) {
                    if ($name == $label) {
                        return $region->id;
                    }
                }
            }
        }

        return false;
    }
	
	
}