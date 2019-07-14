<?php
/**
 * Main file that includes basic operations on relations.
 *
 * @package   Relation
 *
 * @copyright YetiForce Sp. z o.o
 * @license   YetiForce Public License 3.0 (licenses/LicenseEN.txt or yetiforce.com)
 * @author    Radosław Skrzypczak <r.skrzypczak@yetiforce.com>
 */
use App\RelationInterface;

/**
 * OSSMailView_GetAttachments_Relation class.
 */
class OSSMailView_GetAttachments_Relation implements RelationInterface
{
	/**
	 * Name of the table that stores relations.
	 */
	public const TABLE_NAME = 'vtiger_ossmailview_files';

	/**
	 * {@inheritdoc}
	 */
	public function getQuery()
	{
		$this->relationModel->getQueryGenerator()
			->addJoin(['LEFT JOIN', 'vtiger_seattachmentsrel', 'vtiger_seattachmentsrel.crmid = vtiger_notes.notesid'])
			->addJoin(['LEFT JOIN', 'vtiger_attachments', 'vtiger_seattachmentsrel.attachmentsid = vtiger_attachments.attachmentsid'])
			->addJoin(['LEFT JOIN', self::TABLE_NAME, self::TABLE_NAME . '.documentsid = vtiger_notes.notesid'])
			->addNativeCondition([self::TABLE_NAME . '.ossmailviewid' => $this->relationModel->get('parentRecord')->getId()]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function delete(int $sourceRecordId, int $destinationRecordId): bool
	{
		return (bool) App\Db::getInstance()->createCommand()->delete(self::TABLE_NAME, [
			'documentsid' => $destinationRecordId,
			'ossmailviewid' => $sourceRecordId
		])->execute();
	}

	/**
	 * {@inheritdoc}
	 */
	public function create(int $sourceRecordId, int $destinationRecordId): bool
	{
		// move from mail
		return false;
	}

	/**
	 * {@inheritdoc}
	 */
	public function transfer(int $relatedRecordId, int $fromRecordId, int $toRecordId): bool
	{
	}
}
