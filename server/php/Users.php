<?php

namespace App\Models;

use Eloquent as Model;

/**
 * Class Users
 * @package App\Models
 * @version March 26, 2018, 12:52 pm UTC
 *
 * @property string name
 * @property string email
 * @property string password
 * @property string remember_token
 * @property integer user_timezone_region
 * @property string user_timezone
 * @property string first_name
 * @property string last_name
 */
class Users extends Model
{
    public $fillable = [
        'name',
        'email',
        'password',
        'remember_token',
        'user_timezone_region',
        'user_timezone',
        'first_name',
        'last_name'
    ];

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

    public function tzDefaults() {
        if (empty($this->user_timezone)) {
            $this->user_timezone = Users::TIMEZONE_DEFAULT;
        }
        if (empty($this->user_timezone_region)) {
            $this->user_timezone_region = Users::TZ_REGION_DEFAULT;
        }        
    }

    public function userNow() {
        $useDate = new \DateTime();
        if (!empty($this->user_timezone)) {
            $userTz = new \DateTimeZone($this->user_timezone);

            $useDate->setTimezone($userTz);
        } else {
            $tz = new \DateTimeZone(self::TIMEZONE_DEFAULT);

            $useDate->setTimezone($tz);
        }        

        return $useDate;
    }

}