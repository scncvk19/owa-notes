import * as React from 'react';
import { StyledSyncReportText, StyledSyncReport, StyledSynchronizeButton, StyledRoot } from './styles';
import { ButtonLevel } from '../Button/Button';
import CommandService from '@joplin/lib/services/CommandService';
import Synchronizer, { type ProgressReport } from '@joplin/lib/Synchronizer';
import Setting from '@joplin/lib/models/Setting';
import { _ } from '@joplin/lib/locale';
import { AppState } from '../../app.reducer';
import { StateDecryptionWorker, StateResourceFetcher } from '@joplin/lib/reducer';
import { connect } from 'react-redux';
import { themeStyle } from '@joplin/lib/theme';
import { Dispatch } from 'redux';
import FolderAndTagList from './FolderAndTagList';


interface Props {
	themeId: number;
	dispatch: Dispatch;
	decryptionWorker: StateDecryptionWorker;
	resourceFetcher: StateResourceFetcher;
	syncReport: ProgressReport;
	syncStarted: boolean;
	syncPending: boolean;
	syncReportIsVisible: boolean;
}

const owaLabsLogo = 'data:image/webp;base64,UklGRsAlAABXRUJQVlA4TLMlAAAvf8AfEFWD4rZtHGn/sZNcL9+ImAD+3DjOepTToHJYnAcy6wWd9rVOe2m80v4tuyxlHw/pHMCkFPnCdq/3+f//z/O+31rdsw33Ls4AImpOgZOYs+AAOJFdvfpb632/t9cg2Q/vCXD3FVEu0cgi8silayI6G+mJLJqMSMcVl4X7yIeP+0Q4z0T42Kod9cYtc8Y+3N0tcvdnJCJ12atw2I27RR2MRbjbSIbley/cNXXt6sbdXVMm3/VV4W6xu7u7dxWZOx/u7HiqxxUNd000Eakz7o5rRD1ko4eAZZPiOhoRu34ZttDUybRT3J3QnYXLizs0Do1txgd3SCehHUmya1tZDz/4fBbgwPOMwB6ceA6g4Sm0uvdMV/Va59yLlnQkyXZtK/dPkongYf0/BrxvIa2Phse55+y1urrXvg+tlcVgKGDbZtjNLpykSWMVf23btvUrqpHUtm03qhU7qW0jdk5snNN4d2d2Zl6HkmzT0UHYPE8u7r3E/oCkAAAUW2nprgEowFFPcCKC64kEbu+t747P7D5/Dz3p9w7zU2AFKMHt96DST0GK3wKJ8VNgL8VP8VL8HmTwCp7iR/kZsCNnUni2H4QeVPAUXsdeCnoQRzNwJQOBPIW+FGTQl0OCbdtN3WCnN7r0UH+oIQGJR5P5ZLqfL5zemwQBANI22iv3jO3cJYu716I0a9w91djHpNy2dWyb7fdNb3uTms2f8FUz2U7OX/qabaMxf8k2k32d66yz1bZtw3B0yuQrsIfbMM66GfjdAwr9jm/zwe5zzapRmCG83Pderwxr1huj3s+tme6KxvomaNisxTo/w1LJ3ra4RhQmXi8MxltHkx6zzGvOr9bRKeuaZQu1bNqYhpvuumls8y/0fu+VYWYBILr7uqmobqJnabSFi5dU4WQ+iCRwrRVUyLqUdCnpImpyBCep5gvVUVKuhPSmiJoVeXbv/d17pgBg7cRPXhg06+sdgEmjqUnaPqDhkUgu1YpBCBGqYQTRYAIyIAIyYsbv1yEYnSYgipBLo8qaCGSLxBh6r9gTxGfLvB2+ed7CWQD1d1cb2SzXECZQpAURjTCgQzlUGYUIIYZ3DNQaJkKlWq0WqwbADra4XjJK/w4jiNIQATX5WgJC27UnTy0a6GWJ3tF7389LOz0fmZvqH0NHCq6udncoR+nPBiFgeIkNp0bPksnwjdVD1n6sbrweGU+Wq0Lf5zqGy2feyWjjWnQPN4D3YyBr/6fuqkiVSFBIz4jWr8YNpzezgrOAuV0dtDosKLtaVAwnI4kWY0pM+N9qiDb0EY2c+Eq/urma9X7xxqQpXjXrX5M1y60HHKwuJ2j7Ee3k/FOORrcERo6sOiKkUeGSrNW2NScu9LP2Bphz9jL2NY1quzuDbpkSlkshR+FldXiso/X1ufcd1piPtVlmm2hnw6JLDV6vlhe0p7G7ojqUtKIB3VrKzldHzQGLZhIsUD9PHUWuadQ4hIlgIgvBGGoaw3SMCYtN3TqPSot1TVeiH+vsdNdNk/dQvnVHE63W1evL3ssOYiQ2GMKl/EJ6Yos+1eWaR2fDM2g5YKLqKA0iTLklA8jZ0JBn4EiO1SVPu7jE1edd21gA9V6DTOUlUhnRYAMiUke3lnRWbs1ipwX09nSTTh5OjiBHqnQLTjLiMe760QpwhasVl3kg4t4ypPYYu3DI+y1AY1y9RtHEdIHz/RgZ1NU2rK5tY5RiJGLEXho6I2K5j/fl0QSwLr1O0uvnz+23p1XlYbzOA1ZF/xHlEb/Te3if6ml0eoxAejFw0wcsCq7RaN/eAdan59f4DKjfV5vQvrHgygLIQYRgrMDax7ZHFss0xegArrawUB3AWGIDA9AS1tDeCjApBRRMNVHbse/JRqVG6RaVyWUYsrT0j/fxKfrgV2NjXy8phgVueS8NVEi1CMj6QfOZ+MkLAwu1bBpunQ2REIP5lrWSTXoBrO8n+s9CP5x22n61v4SJMjREMPKab4+OhbQ37wvuMpFVFCmQkb+kImo/nO8HsKg9z21F4ktBHzJrURE545D1M4/G937+SoPoVNuo/eYwVEchQ+toGLkYF9NKqxTJNgDlSEvQQFgvbNAmKAA7vP5vUrO+N4MvlL0Nrev1KbChbJTDEHUT46yboU9d3RDThSWvrNjSKAPlIWtcQff0fqKf3ph9kaC06NEOfuL1wqDAruPR03Wkpw1pxMu8vlR3YNMtOgRVK5aszsAtiYaGwmiqD56moJaNqVgawxTMbfWHKwgTr5eGE683RjN4Zs0I7Mjdw602rhOtnsVhSOUdI8CC0wg/KUtcudaHtARu8i8IbYWxcz3WMiepJM2Dh+86ud7rlSYxaqunwtrqubhXSilrK6iEtKCrtgILxz1sXxeXNUrL7OXXKa2hzVFkaaq7TNDTauBDYgPRBbWPj64FUrXAcXOQGHB1CW1LasTbuLi3SR3cUW8TzJ4juLWHCfCQCcfjvaPYEGrE4578y0pFmbzsnC1UoJ3lGJkaRoKwd7XWh/y8Dy3n6l1YciPAvxyO2r4qiCvDVcw0gqH85aJ2sT3jvPf9yVZLKSU1WguR2jSqDruI1u4QZf4PgaEIMSSkI6wCsAwN88hjQ8qw2zM5x0rVOaKBaaFiT4BNqfNmYFm54aCjEFE1KFqPj0nexzONqGUmXRiloIx6ZUTYK1YkXalba5qiM87/N4N9n8Gzl5oPBSATHVWPpTDJtLyFKPUWwt0XV2wUgo2E1AQQBEDHkH5PWLmZSN+pCGE8grKM6Jgz9P+VvMsSRjM20KhYXH/FtFHvk9en2AM0yGRUlSHbILyksGryH0lmiLbf1udCURnBGB3t7UG3EEBdLsjWu9y+hjrfgL7vnoqeN5k5QSknnOlCll2MkDsLZv49spICTBBXioDdy5l1A2gmgHaGBjhAB2hckPbAKmQX4zGMpTCWEaYl/b7fyT1WKs/Jao67Ksp4vWbdjOJunth56DHLnCFlYG0fconxabQU1i3lUd2MVaqpeirFpIvfOWhKSEpJlylTokyp0kUnrC3CW1V/7Kb/zmvjFY1FW21HtBM6eL7jsANmIJ+ZgYErUgQZmUmSHjdu+m2y7d5sq7kz6wA0AWgDjQ00R6B2wcojSWQEFQmMZ7Apx5sKyFjT59NE6TFG+bnYaZGj2O333zJC4UULpa8VA7dkAKLfu0Lt3CD+ZTvy1tmQyuA6n6WEVfEVU53MqJBKJasCKVrePjbeOlpPtN6YAVKaCLUaEZ6uJ3i3luC7+oIkgpDwjMhMlJTMoS686VEwPchuBBXT7zD9HstpHHBmC2AsfkPjgLTLFyIDMkSmXOKsgEFJmFbMrHsqzynKykR5WUxrlegxsAXDgo6naYBqFI4Zg+4L4QpWTLwV0Ct3aBVG1UWq75DGSqiE0/Ylrv0eeidnTgC7+/bbdrvz9J2p2vZrp5b/3FbW/7+g+y1kf8tMb/JtRPhX0vyZNjUxWUk8ahLQo4geFYywYYvl9qy3rYEzmwC0AAjYgJXLFyxDMmnGc1JiKqBTTbyvYuyjcxQcExXnbNyAmtRjKdgAeHeKLFlsxL8aQOA4F+ywNWjR76zPEjrqi9sj0bPixwnTo7W+FNvlP76IBv7jan/6cUVZf75X998C/pvM9Euz3sCavSM2e8eTb8OzkglXMomSKdREo2Seddoi08C2Byyn88uZDZ52b+jAyidJZEz6CmcZnKXhQgGHKmJDE4N+3Mk9FqSmORtaH4vLEuWsj0UIROSIBu0EpaCjLDTyq+MCs8aNVFe3J6glEXTTwJG9rveBO3k/bDfe+rjSCV9/Qvciaj7JyD818w6KGXdwmvUa+e/bEJu94+7bcPwryRsl06iJQU082iLQokeVY1sst6PzrG1NnnYDPAKNB9I+RIYQmZC+1MpZEgLyEFARghqzO1NzP8PCDWIay2bo5QuLzuucnVk3ElFNmhm6UkfNvSvYwlsvcD/HEkyN9uPWrQNcrYSrq/t7bvfM5RIm65zH36qm+z9T+vJns5p/X/Vv/z/r6z8h+0tO+Cd1R+XbCPevZFIyaUpmXMks2avaInHb9Cpb9neeta1F961nD04lsYpJX+Isp11MJS5UMGiJ9y0THt2iRyTu0QBYP4Et6IcDmeDiOqI0GK9LtM/Hb2jj/9BqMwqTBUQSBYX7Q7d61M8Joa9IKaUhiGbDI5NGhDYZEbqmL+hHa0FEzX9Bh0hfKSmZdTVxSVsE06PkelB4b7ktXzsb466dy9uSVEQwntKaEqzAhRIBLQI6IsPArv+K2EnM2VGrZtc02AJgEVpDRHPGRAOUiW1Jw8ez6jub6upSzlVoZg3v/eKNyYWwStJ0zmnfbN1cvaOsYtre33u9Z7qbT99tsi95qpYg1AAdMmpHfI3tyUtWoN7bkRLTmAhSsqMgIyhu+k2y3NYst3fL6jSAeHRkHO9Y3vb6zFHGcxgvyV4VUwunHbGhY9LLW5SUKarKmKuuo6jzw7pCfkNDTHXtVR1Ph03huLZ31uXM5qJllX8LG2TQMuQR5BJoGWVRnaOawq3VsbL06Z2wfUxN/iHUUfXQMaMOMuuB5S7ZTnqHrKQA48WVLOh2spzmzqwlgKYBtBwZ4F0dp5IZKmKOMl7AWUlWTDU9LrQI0hHvzwz+OUXBdYyK+ylXjTUPFgVo3LkqhlSNeocUvPsMXN2b4PItiIAM2mdLGLOdbXt7+5zmNP4c0O27+R2l+Sg60rVYShNYq+shbi9B3H4guFOYbhRgB+HZFEDg0DgJq5MR6efXmcuMZ9Q/cqGkgUs6ouMZX32n7ByjsjxyqEDmcwGeigVrP4Ow8oqOpqQxWOryOmuUoSMnUYQRZsqor3hOIpy0+oqvSFhVui7yCq6bY7jvatLkNhkRBA0e18Y419dyblyi0v7ANFCEmIoQW0K6wjKAyCBRERlnWW5/d9WFmp4Wj/YIeibRDQz59SD/MqE104LbhE3qR8DUrZWp29DhsnzxLg2/0uHNlZHaRXFluHI4Gc6aL1E5qiKENTSV35he/KFEp9WHAAwJdlzJ+emsYO+vufCU6BzFe1cBloizHBfy5EJpHq2ySxs82hIgPS45k5358k5JWeGahghUR8Alrk3V7Kiuo0Rn5iNLwTbAOkOPEQwijEUscYlL7FaGMMFK3oyL9Mf5A9yEh4LTqTrA3P7Q6K4MkuBMgIavgjTR/Fex5jaJQlBKQIsHXfJobwEyZJcMxPtL9Ps2x45l2NLJ1NPZbdCV0OK1MCRpgWDBOG+n5yNzn8bwqkE0xuVmFJShImKJlLAj7KhyVcD2CqZv57xg6DGwSV2v+tFDKaWsreLKuc+DvlgbLY/26clIn70Mj6UWvKy0NkI6ueOZOe3ZJj65W81spjWpqu7dyBIeFzVWA1YepcH16XTcswZ3kLb3V++1mwhhjMNlKZJ6l3447UDR9l4ckNaigsimVjcbzX2e9SfqalGsa49Fu/Z5aOhi4Yta8+qzdv6AAKlGQDi+xSd8F6PP769iiAa17q4GwAFIQ+1xfS9Ki3sgByWWClGHojs7AJa2nHrmDi4n84VV2KHaKi4GgNqqL482RW+4rhYtejQe3a2/UrrjCRfMrkf04ISKtYWa5E4hYBNvCxoSNulfgeVdmEYYQURv0Cn1m1sAWYYee0bWzQWWCFgAKPjQxOulJu/QRNc1zoBYWEmjfYnk5HBrDEwxtKThBNpSmswe9GA6atDq8oUAmYdD8EAnQSD9Gx4AUjk0o9JK3+7Q+s9EIJsNNAbpt4l4ZmB6XatylPKZwqbDH1OKEqRvAXlzICPs7SldoYxO/NIytSjlZhh9c38pYcrUToVx3r0ZJiEk6dAqOUKHkp19/ZVlSi/gsPp6LqjNAVuz/jUB4C0wiIxWdXBncClOpBhxrq6jrNUc2NjW7DFIVFanCRDzFC4t8tz+f3pzBx25I8svaWoZlYRvGCj1pBQnmBxWyVgK3Gor1ceRxcLB2F0FyKaXL/XxlI6gBVJt75UTjGYgs4BaNjWspRolR2noCBST5RtrJdpS/A4ykraT200EhmdwCX6b6dkD+vh7q0tLfhasb/y/8RpkHWrW92ZTMUoKUxg9S42YaJqjodHpFAELbgL9nARyhsW3rxZIems1cNNPvse0fjgQfi0CM1cHDDNcK7ikGBqzPQjGTIPQIuYQ0VhNirvRAoG9pTUuLMrRKZ5oBlG+VeUWbMom+O4Lm5TO9BhLkEFx9dSsF3JJvO/Zvtm3Dh48+Ga/tZMh0aV6oZT/DOBF2MCQMfEV7CDq0agONnHnnUDfJsXUBFUkNaTjtIAMAkO/VZC4dRYhIAYT4a/IRAhURndfO2BsiicG3UO/8kWqUbQwieZj/aujLPIErhCLF9NHlCbKYNlvtvV9n+NTPdXgwa8ROFQxjBgw4bmc/eBSxG/9etCtRghS70JLrCh7v3hjIjrzVItG+cHGpsRDM4Zx//RmAmyOgxvCvl9P/yCblZdNpHobs4ZN8cL6H55slalQjBhD+jzaYjFuf7QiU3KqJZFLyFJJyPB9IQ2u1YY976uREMyppsoRIUK7pl9zPZnhZK9c4LIx1VsNIq0lAgOQcgc2FudHWve43RfTZG0U9EWvBRrty6XBmmolWDg1XID3n1O3CJESxIdxAMvKXnOCwQtZirCCkjrKIqGx6ILp0fp/FMOGc70vLVjs5/4yJmw4Y3W97SGCQLUu3vqqvkC0XhtbMzWvLgsMTxrt9j4N4JnZYBTpqASQq9qxNCiG5VKQsrfp1ugLarqafhoirPwbBg4XVS7VqVkD1lqo7eEGgXHKyHyeKT2U5VfnAMYxcWjotXNnXLeh0jxi4AuQ3EeKSiyzQSurzNC1ve+nFQc4rHgvr2j8fN08vVt5gHXcQAMQiEqA8S6HI2l94PASwwm0II3oMbVAafnfRXnULFvklbz31kXcWzJUt9JtD4RLDzXrZvTvbGAAp5PglLWyFO9dSbA3bEqa448NEhpeDAVuNlq/Gjfx6VdQ6i2qq/+201m/GqcHtWzKOpsIBmi4lQBDN8gxtrH5lGD95S+MsadvNCE6ci7RnR3uWsed/1hQbM+ckGpXXzfIp4QDUKYqcIsiywVk8XRY/WwfzfhNGpU31radOHS1cHo5OesV6DF/mUdRJzOaaFIejE6LCmL5KCqFoVAZPeEGjmXSyisy5jpUG+r2AQDIXCq11vPHs/P9rbGko21oiaej9MNyB+MU20TvSXpXbwFgkAmLQyuS4e6I5TFIldwUhpQMYHQnEczpVImIv3sNYkT9XCD0VbzG3nwD0a407J7sHvFPL1Ix6QXxmwykfQf8HeGq2sef7Rsj6YqCLuCMDDXNULukCheUqafr3mxAuV0xWNAsNaJzEFBnoyO2BSKsm2P2vK/RrQjpXAnpepb4kLoUTfVBQUXflNiu1aBb6WQyGjYeojZVlUNeY4VwBel8C0RTu6JU5Taq5fbuTRMjryNwlHtdLxF6oNczeJpppnnfwYNFi9d43CUuaEGnOjqXgoB+xRha6Nf/Nmj6YDVwM+U03ny8fCz4aEblAQ2Adpxgm5JRPBzG/W23NKkndbMwYEAYkJvGR2y4tVqplErFcrti2Cw/e/GXrUU81UWwFvOe90VchAQ2Gx3kcASNYgcBgLM+uf9goekIA/he1llD49/K4QIZy8SoIQKj0003Bx8/LL98bTc85bZOROC5Bh9udutq4eqomqjKJAWzWJwZr3sPkcj1Cej+KUKIInS+xpb6dy99mobTtRIXfbMLKrN+J3LGlA1vON7lcARgCzB7XLTvZwBsHsMl4LM0DemjDIDlNT4y+VTDydtaH11JHhvqlIFp9bt6nNGUxHSpvc0ApkZze/Kh09kjdafHmwMNqifiPtC012kVdIVfmaPgiWCWi57N4MueRoN4X8ZiQX748IqgimkjltP0P3htnPh7jYMc9xZRFaElDQeTmGkLg/z3V7k5Yd12EpoPbx2Aub+Nlvk6feFURHIF1es0Nny4h7vhDZs0SFOCimcWO0TUDh1GPQOAqDU4pA+K/shSF9GosgERtugrnY1G/H3n/VBb2tKCvrcYpmFQotRLk+4c6Y21sjSJAdDxtCScRsJYHhGNdfhw1lzYJFrfAjB1a66WmayQO95CaUipOHrZnZxAEQQMU4SohChGnVO5tbRsDjqTfqHtnTrqCyC3n1rpskRU4L2XS1UhWDo16jPNkhPSnzEVoZME3bLE2AbL29tPZj0c2EQYwCGR0eeLN5ZQ5Nn96/svX7QX2uKPOA8YapqZCtZRdX1OjHc50HMWqu2EJUWqlC4gyOSQTiaDdI5qKq+2vVqqtF+WYqTAUd6v9XAZOOk0jS491EQ/vTEDztt0DTftvUY9FJ3DmG2jNPwjipVSqVSsTO9yR10WJDqklk1r1r8mSZ453v7YikzpKrQG18+SqSfvyMSVOxlnD4JP0NmN5WyouF45Md7ljopG2aIeanRaZPnlX12PX79rdnt9rM3NDtMPp12Uo9PnmJEb68NcIgVnMmHVaidh5R4UUb+yOlBQsUSRJr3uJgFgwu/vLeXSE7Ry19Gxo2cVQvoR1U9fSaNolkAT+VJ9nLY3ie0KAOYnt9ZR86bfxHqq55WDPuTl887mZF5aBo6PVYmRy4/k41vEmWo6qZ4TmtKZdIhslt/kTn/6kXkM0bxroqk+r8o7AY+6klLnSwZuqdZR9i6aQisHMBSZ6KVGnqzWiD1B5+y8k7eHbWOJDpqC0x0lPYK3Vwg+pSHGpH/r0d0L8k0Dp1MNuikZ5U+SbRw+eh/XW2K5jRiMGCRwJKSKRULozMzom7LO49WWWefzg7O2LY+f+KWlbE09B5akN2uttG96HSohysFKfnPDK5ktg8Lwh6WAdA6jjLVt4AoZCknrWctRCgs7iw2b9HsJ//k43TGV4GpO2CiJXyW1Dn3MpsjnMiWM9R/1m1v4EU3Lwswa/nD3A8AmW+vgXWYBOHPoRSfurPwEpVOtVLsNgA2IQDlQRPzsz86po7MzjJBLoX4Wel4u7GmRcelm9PQquahdbBfOcFtDnr8aVouSOqkZjmrD01bpeDuyWLLWNtEFWrKszeV30xabrxHy9OxQUd30lhNvH+ZNADUf1kamiMwfZRqUphQYYTkw9YGjJ5PPOv67Ne0jaMPbTAHA2RhJ+aFr01gw4UzKE4/uPF6MdPkSZ6yMdlBcT22q57ixjR7QFafQnc1/uT4fdXpiizXffOTZ/WNW3OM2HYbNJX/85rIExuWLuy81l4ZBF5PrZAvqXKxOWyHjnpiWA0gNDFmbRF16nqeWcW/AYrwvDyuDNs+cw+J8Okq73oD3cPYHDL2XNwc4/j9PDkSc8knaZJPnXW2sY7/nk02Q/yS5bXb+wKhuUEZd+uOoZVPnEwrFzNlL7IcSsdbW4jYYqFThXwi7VkYVPXNCFHKXe3t0OX9nOS4wHEQGByoRr7owrj199MFr48cEqzXj5YAezfHTWb8aFzBeeI7qOnIpiPaHBZJnqvGtXOtdkqzNJ+Zjy9RMCana1jkZQLlcfhNvUJnsHgFwdMxE6lc8HFocqO0XTQmFC6JT1g2q4rcY6v+RcO0Xwo6dWqLCMM3vrWVEYpPnhrGkCRaBQzXQs/IOSJ79Fuv6TT+uIiW9fm77rq5EVfKync9LRkf6vLZdxFpwxKzrmPCyRsWTeTNruMRsNMPnsdbfpE6TLbUKtQGDYKb3tnaSCe3byHW15wPXUdxBYsFmYL1tyLUWmdyGBQrJRM7sb8CWimQ8E9wEDqL8K4fBJkPHnQFA596XVb5y1MMVuYah69uGBHLcgEhoNA1KpPkRaL+zayjp1OcdKPUk/zR+Kp3W6cAe8I0lSlpawsz53FYrET1h9mZsau46Qe6bVD1uCjIlh8Ex4ZoGD3toklmJ4PfvW5HULZxFWT2GWjsUly+B/R01lXy/HXEhQ4bP3BuvQYJIKXDzWjcNR9DUMrCebdJ4Xg6JS/NtYOxZN4Wb6dz0/ur0koSitbjXKI1pcxS+DBYoLKMT9+okA4nE9X7xxsT6WDrammloCEA1b2HzOQj6Up6xzhoF3epxn0VRP3A3G76Z9W5JB8EmDiYdEk7DAJ4EQ8dZN4P6qY6vPj/GxKj9OtSHkWBIXlpXsn0nU31AHQtu0nusv8ydR4HRkflQXlaxYV4uFlduIjFa1C2Xjy4tAUU2kGhqnwecZ5FxdZhay1p5XMEwIzfC6c/b8U86KtUDSNfmfnpqhRb8f+sAM3oMHR4bgOeyGDbJvgfYHMfsCA3AVBNhCx8WXJ2GBtbqltZ6J7BxOOX2zotsvBF5P2Z+DReLvfoD58manNcAat6D0b5q4KbKcIrJtZP2x1D8z6YoYZ8U5Zr6DHJq1j4KFqzTvzPBMpMMCj/fRuBIY1hfKzwBFoy37OXBzPhG7wddMdKY9X2ugnFt7Xlui5r1xsTZG0Fw6PXSQgQ1Vb1+/twemFLs2jcmhm+6HN6vcf4GCJdvUTHs0Dq1NR5PA0FRURrrvQeWzDtm0AaOrBwSRZD2UmRxeEwQ7KlMPppNpvhs6TzSiKQfVWq75TLHL6z1MVHQw1GMhY4+TAEAk4mKfZwQ4V1gHVazfGKkAco8xNJA5Ujx+UepTkJLzboZ4dt+ZdNsUB2eS2H5ow5JEsE4LdZ4ZBA1d5otkUMFKJdhaeSA8zpqzrqocx0lxp4YGWN91NX9RZQzWTZprcjWMOfIq2DZKapAAq6ZtX7W3mXYgUEIGCIxl50R6L2s8Qq3eA5KWPGd8DSe9LvKmTAuNPJE9HPWz6l5IfCUjH7TRdYrYGNESTN9JFQT4c8dpaH05gKccR+XBdcZezYPpozSqrY34wljyGjtYiLGBqdaWfbrlolglEDDnTTUg8ekFBcb4AyRsLCQcKkuJRjKh3VBp6b/SsCWyh+WxzGc3jRmvcrJGBnjt47724+tBfK+ctohy0lvbiiDMh4hgjJEEVoxqcV4mph4+Yb+pQXV4aUyYZzK6uHyiLAJ6JULn+EtnJ97LgssAbA7Pctc6Jyec6LXnFD6JZ7QOWvrf3iyFVJRn8J4c+GfYJtifD8i8eVpBzD+Et193dR5pBdpc6Z78jMR4Tvo01xjoot6TdX6mEH+Gt2dhdqMAlx++zAyiJr18AAcGC0Lzu7rMYWok0yfDFkndKeHd3k89NaUKH0mok99H7qa4Kt/PO1M9KMUMFKnhLwp05wb9hZH1z05ESbA+cgt5gIXS8ADSQUZ24rWrOFnaR2d5xqc516wKa9r5zq6IQ7m3SvQ9HO8bbFZ21z4/nBszKPHfNesBX1xAJzuGDzQqS9GYlB0qk/N+dW60bu2tNhmRuK3NEooKkbqEF2j9h6FLOX15X6o6EcRQtCRuw2Nh0BsbVk8DFVf82vbm6FXxEUk9R9sA6h6LyqdN79IPxq3P1p556ck9dZQn6RKCaORcTR9BnIP1Khw1LRs8LM6jEo7AQ5DuY6MaChH6b9hKfdq1vdmyOKwF1ySbeYBC1G3ItebGTnnAZIM0ttXp+qayfA04OifkIWnO6tniFUhMOKsoaZzpgN0KKs9MyI/pV0cIeF6aZZBRynq6Luxu8J2NQ2ql6jtn3m0kLvc22u7VokHV+Uf1jdTOz9p5yvbT1Sd8LUNmy5W28T+oasPf9b0pgVOq2OV71Vs6dx0yD6PNFPTa5nB5kB1Tp9ZFvjzSIBtEqTcuVQpPL12z8ypkYG2/Q2Vw3YI2/FcvlnnoZpc0ofo7JFUlOPF0rBYndrzZ4J0SnyQNbm3rvduRr3rDjr0AXMRxHyeLMHdfGrPMVPOGtUO/Mw3KT/1k8HbJtrDS4u8u2FGH3sc94Yft4cVtyP1ffXA8TzmXcOBjCfJK1bPtVxo2I0VUwnnzWeN/Obuxzax7BS6rLn/YuBDXmJxb34XFv0GQAY60+djrr62mwaOUhRddqgeziagbgt4gbEZENEDtXpzl9d8raMES1yvQ4r6xvsk8RlEey2YMaZlgw1z+fx0DU3N+nyd4FzehWMbTW0456zPE7W3eWVnga8N255SlDCAHFkxLASI/inOAFiPfgg4QJs5ojNLRNgk5U4dHms9Pq15RW8d8GTGPqpVVS4FYtilGgzRVPTJQciawbL3SUWdF0wqihDFkHNb8HdH1KyGJZZdbYVZj7HWApC5ekt1UUQX0fjemQpBKND6g66GAq55LPuXmwfr8EADDGDlpz+gzJCoYXee522zZKPgLtvWBaD+9mSrbRedfvzc3fN7fmaw/P3ZKBqf1gx24ul09NYAfP8PHxilQaRR6mcmvU63ejQi05ZZ6/oGa21bowYRcW+pkZOm74oUhQgGQI56qeUIQeM8rbeJz5Z9Vww3l+AcENIzNsOYjVFuTE6EDRjzDWTiWV17pE/8myQTWrPWMlPoIxK9Yq0vljr2hBg2JgKEUcIjTgpYNKdgPSB6sBhfwcVGo3qqk/fvLFZ/kaWA9QeDbm9PU8voMFNnjVr9WXG75/HpqG94X0PuhJUbyVYuXjNinUa4fhslHbDES1VuVWvk0hDcYNLRual5vZc1ja5qXgUH1N8etmcgdeiFVSManZu+1P5kMGpMjkapIgDSYuvf8A3K8K80AF+qFjv39wH7dxRLgmWN3xt7axR1QnMsNVYnGO9yOJroH1Fe2wk6jQuuDjhv0dj0eld+r0E3Ddw0cOiP/Agl5GUYkxPdYkcxQqiyVllnCNw/8J6cnQG45CWfogJK3gMsAPS4TYd3ZLxPIERLrJZSMhI1WHDVACqtGy4Wi3d5bYJ1otNEnkp98fvkXL2H9uWWNzHTrP/71UiRRd+UtbldHRb7D3xwlvbS0wxTa03Waq3cdbRQqzmXGOnux9OORhoBMwQBzrbZJGSyJNqomVeAc9ZmfYO11nm/h9v/Lu+hNgAA';

const syncCompletedWithoutError = (syncReport: ProgressReport) => {
	return syncReport.completedTime && (!syncReport.errors || !syncReport.errors.length);
};

const SidebarComponent = (props: Props) => {
	const renderSynchronizeButton = (type: string) => {
		const label = type === 'sync' ? _('Synchronise') : _('Cancel');
		const nothingToSync = type === 'sync' && !props.syncPending && syncCompletedWithoutError(props.syncReport);
		const syncHasErrors = type === 'sync' && !props.syncPending && !!props.syncReport.errors?.length;
		const iconName = syncHasErrors ? 'fas fa-exclamation-triangle' : nothingToSync ? 'fas fa-check' : 'icon-sync';

		return (
			<StyledSynchronizeButton
				level={ButtonLevel.SidebarSecondary}
				className={`sidebar-sync-button ${type === 'sync' ? '' : '-syncing'} ${nothingToSync ? '-synced' : ''} ${syncHasErrors ? '-error' : ''}`}
				iconName={iconName}
				iconLabel={syncHasErrors ? _('Synchronisation error') : undefined}
				key="sync_button"
				title={label}
				onClick={() => {
					void CommandService.instance().execute('synchronize', type !== 'sync');
				}}
			/>
		);
	};

	const theme = themeStyle(props.themeId);

	let decryptionReportText = '';
	if (props.decryptionWorker && props.decryptionWorker.state !== 'idle' && props.decryptionWorker.itemCount) {
		decryptionReportText = _('Decrypting items: %d/%d', props.decryptionWorker.itemIndex + 1, props.decryptionWorker.itemCount);
	}

	let resourceFetcherText = '';
	if (props.resourceFetcher && props.resourceFetcher.toFetchCount) {
		resourceFetcherText = _('Fetching resources: %d/%d', props.resourceFetcher.fetchingCount, props.resourceFetcher.toFetchCount);
	}

	const lines = Synchronizer.reportToLines(props.syncReport);
	if (resourceFetcherText) lines.push(resourceFetcherText);
	if (decryptionReportText) lines.push(decryptionReportText);
	const syncReportText = [];
	for (let i = 0; i < lines.length; i++) {
		syncReportText.push(
			<StyledSyncReportText key={i}>
				{lines[i]}
			</StyledSyncReportText>,
		);
	}

	const syncButton = renderSynchronizeButton(props.syncStarted ? 'cancel' : 'sync');

	const hasSyncReport = syncReportText.length > 0;

	const syncReportComp = !hasSyncReport || !props.syncReportIsVisible ? null : (
		<StyledSyncReport key="sync_report" id="sync-report">
			{syncReportText}
		</StyledSyncReport>
	);

	const syncReportToggle = (
		<button
			className="sync-report-toggle"
			style={{ color: theme.color2 }}
			onClick={() => Setting.toggle('syncReportIsVisible')}
			aria-label={_('Sync report')}
			aria-expanded={props.syncReportIsVisible}
			aria-controls="sync-report"
		>
			<i className={`fas fa-chevron-${props.syncReportIsVisible ? 'down' : 'up'}`}/>
		</button>
	);

	return (
		<StyledRoot className='sidebar _scrollbar2' role='navigation' aria-label={_('Sidebar')}>
			<div style={{ flex: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
				<img src={owaLabsLogo} alt="OWA Lab" style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 8 }} />
				<div style={{ minWidth: 0 }}>
					<div style={{ color: theme.color2, fontSize: 14, fontWeight: 700, lineHeight: '18px' }}>OWA Notes</div>
					<div style={{ color: theme.color2, fontSize: 10, opacity: 0.68, letterSpacing: '0.08em', lineHeight: '14px' }}>OWA LAB</div>
				</div>
			</div>
			<div style={{ flex: 1 }}><FolderAndTagList/></div>
			<div style={{ flex: 0, padding: theme.mainPadding }}>
				{syncReportToggle}
				{syncReportComp}
				{syncButton}
			</div>
		</StyledRoot>
	);
};

const mapStateToProps = (state: AppState) => {
	return {
		searches: state.searches,
		syncStarted: state.syncStarted,
		syncPending: state.syncPending,
		syncReport: state.syncReport,
		selectedSearchId: state.selectedSearchId,
		selectedSmartFilterId: state.selectedSmartFilterId,
		locale: state.settings.locale,
		themeId: state.settings.theme,
		collapsedFolderIds: state.collapsedFolderIds,
		decryptionWorker: state.decryptionWorker,
		resourceFetcher: state.resourceFetcher,
		syncReportIsVisible: state.settings.syncReportIsVisible,
	};
};

export default connect(mapStateToProps)(SidebarComponent);
