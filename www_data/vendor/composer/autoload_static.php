<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit6d9e453bd4000f61b9cf03724db7d40e
{
    public static $prefixLengthsPsr4 = array (
        'S' => 
        array (
            'Symfony\\Component\\EventDispatcher\\' => 34,
        ),
        'L' => 
        array (
            'League\\OAuth2\\Client\\' => 21,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Symfony\\Component\\EventDispatcher\\' => 
        array (
            0 => __DIR__ . '/..' . '/symfony/event-dispatcher',
        ),
        'League\\OAuth2\\Client\\' => 
        array (
            0 => __DIR__ . '/..' . '/league/oauth2-client/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'G' => 
        array (
            'Guzzle\\Tests' => 
            array (
                0 => __DIR__ . '/..' . '/guzzle/guzzle/tests',
            ),
            'Guzzle' => 
            array (
                0 => __DIR__ . '/..' . '/guzzle/guzzle/src',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit6d9e453bd4000f61b9cf03724db7d40e::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit6d9e453bd4000f61b9cf03724db7d40e::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInit6d9e453bd4000f61b9cf03724db7d40e::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}