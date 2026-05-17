from django.db import models

class Score(models.Model):
    """スコアモデル
    Attributes
    ----------
    id : IntegerField
        スコアID
    player_name : CharField
        プレイや名
    score : IntegerField
        スコア
    achieved_at : DateTimeField
        達成日時
    """
    player_name = models.CharField(verbose_name='プレイヤ名', max_length=20)
    score = models.IntegerField(verbose_name='スコア')
    achieved_at = models.DateTimeField(verbose_name='達成日時', auto_now_add=True)
 
    class Meta:
        verbose_name_plural = 'スコア'
 
    def __str__(self):
        return str(self.player_name + ":" + str(self.score))
# Create your models here.
    
class Rate(models.Model):
    """スコアモデル
    Attributes
    ----------
    id : IntegerField
        スコアID
    player_name : CharField
        プレイや名
    player_rate : IntegerField
        スコア
    achieved_at : DateTimeField
        達成日時
    """
    player_name = models.CharField(verbose_name='プレイヤ名', max_length=20)
    player_rate = models.IntegerField(verbose_name='レート')
    userWinningStreak = models.IntegerField(verbose_name='連勝数')
    achieved_at = models.DateTimeField(verbose_name='達成日時', auto_now_add=True)
 
    class Meta:
        verbose_name_plural = 'レート'
 
    def __str__(self):
        return str(self.player_name + ":" + str(self.player_rate)+ ":" + str(self.userWinningStreak))
# Create your models here.
