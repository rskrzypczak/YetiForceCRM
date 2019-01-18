{*<!--
/*********************************************************************************
** The contents of this file are subject to the vtiger CRM Public License Version 1.0
* ("License"); You may not use this file except in compliance with the License
* The Original Code is:  vtiger CRM Open Source
* The Initial Developer of the Original Code is vtiger.
* Portions created by vtiger are Copyright (C) vtiger.
* All Rights Reserved.
*
********************************************************************************/
-->*}
{strip}
	<div class="tpl-install-tpl-Step1 container px-2 px-sm-3">
		<main class="main-container mt-3">
			<div class="inner-container">
				<form class="" name="step1" method="post" action="Install.php">
					<div class="row">
						<div class="col-md-9">
							<h2>{\App\Language::translate('LBL_SETUP_WIZARD_HEADER', 'Install')} {$YETIFORCE_VERSION}</h2>
						</div>
						<div class="col-md-3 d-inline-flex justify-content-end">
							<div class="w-100">
								<label for="lang"
									   class="sr-only">{\App\Language::translate('LBL_CHOOSE_LANGUAGE','Install')}</label>
								<select name="lang" class="select2" id="lang" data-template-result="prependDataTemplate" data-template-selection="prependDataTemplate"
										title="{\App\Language::translate('LBL_CHOOSE_LANGUAGE','Install')}"
										style="width: 250px;">
									{foreach key=key item=item from=$LANGUAGES}
										{assign var=LANG_SHORT_KEY value=$key|truncate:2:""}
										{if $LANG_SHORT_KEY == 'en'}
											{assign var=LANG_SHORT_KEY value='us'}
										{/if}
										<option value="{$key}" {if $LANG eq $key}selected{/if} tabindex="0"
												data-template="<span><span title='{$item}' class='flag-icon flag-icon-{$LANG_SHORT_KEY} mr-2'></span>{$item}</span>">
											{$item}
										</option>
									{/foreach}
								</select></div>

						</div>
					</div>
					<hr>
					<input type="hidden" name="mode" value="step2">
					<div class="row">
						<div class="col-md-4 text-center py-5">
							<img src="../{\App\Layout::getPublicUrl('layouts/resources/Logo/yetiforce_capterra.png')}"
								 alt="Yetiforce Logo" class="w-100">
						</div>
						<div class="col-md-8">
							<div class="welcome-div">
								<div class="float-right">
									<a class="helpBtn" target="_blank" rel="noreferrer"
									   href="https://yetiforce.com/en/knowledge-base/documentation/implementer-documentation"
									   aria-label="{\App\Language::translate('LBL_IMPLEMENTER_DOCUMENTATION','Install')}">
										<span class="fas fa-info-circle"></span>
									</a>
								</div>
								<h3>{\App\Language::translate('LBL_SETUP_WIZARD_BODY', 'Install')}</h3>
								<p>
									{\App\Language::translate('LBL_SETUP_WIZARD_DESCRIPTION_1','Install')}&nbsp;
									<a target="_blank" rel="noreferrer"
									   href="https://github.com/YetiForceCompany/YetiForceCRM/issues"
									   aria-label="github">
										<span class="fab fa-github-square fa-lg"></span>
									</a>
									<br/><br/>
									{\App\Language::translate('LBL_SETUP_WIZARD_DESCRIPTION_2','Install')}
									<a target="_blank" rel="noreferrer" href="https://yetiforce.shop"
									   aria-label="{\App\Language::translate('LBL_SHOP_YETIFORCE', 'Install')}">
										<span class="fas fa-shopping-cart ml-1"></span>
									</a>
								</p>
							</div>
						</div>
					</div>
					<div class="form-button-nav fixed-bottom button-container p-1 bg-light">
						<div class="text-center w-100">
							<button href="#"
									class="btn btn-lg c-btn-block-xs-down btn-primary bt_install mr-sm-1 {if $IS_MIGRATE} mb-1 {/if} mb-sm-0"
									type="submit">
								{\App\Language::translate('LBL_INSTALL_BUTTON','Install')}
								<span class="fas fa-lg fa-arrow-circle-right ml-2"></span>
							</button>
							{if $IS_MIGRATE}
								<button style="" href="#" class="btn btn-lg c-btn-block-xs-down btn-primary bt_migrate">
									{\App\Language::translate('LBL_MIGRATION','Install')}
								</button>
							{/if}
						</div>
					</div>
				</form>
			</div>
		</main>
	</div>
{/strip}
